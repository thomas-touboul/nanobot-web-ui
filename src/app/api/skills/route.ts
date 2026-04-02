import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getResolverFromRequest } from '@/lib/server/request-agent';

export async function GET(request: Request) {
  try {
    const resolver = getResolverFromRequest(request);
    const skillsDir = resolver.skillsDir();
    const root = resolver.root();
    
    // Debug: force write to stderr
    process.stderr.write(`[SKILLS] Root=${root} SkillsDir=${skillsDir} Exists=${fs.existsSync(skillsDir)}\n`);

    if (!fs.existsSync(skillsDir)) {
      return NextResponse.json([]);
    }

    const folders = fs.readdirSync(skillsDir);
    const skills = folders.map(folder => {
      const skillPath = path.join(skillsDir, folder);
      if (!fs.statSync(skillPath).isDirectory()) return null;

      const skillFile = resolver.skillFile(folder);
      let name = folder;
      let description = "";

      if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, 'utf-8');
        // Simple frontmatter/header extraction
        const nameMatch = content.match(/name:\s*(.*)/i) || content.match(/#\s*(.*)/);
        const descMatch = content.match(/description:\s*(.*)/i);
        
        if (nameMatch) name = nameMatch[1].trim();
        if (descMatch) description = descMatch[1].trim();
      }

      return {
        folderName: folder,
        name,
        description
      };
    }).filter(Boolean);

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const resolver = getResolverFromRequest(req);
    const { title, description } = await req.json();
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    const skillPath = resolver.skillFolder(slug);
    const skillFile = resolver.skillFile(slug);

    if (fs.existsSync(skillPath)) {
      return NextResponse.json({ error: 'Skill already exists' }, { status: 400 });
    }

    fs.mkdirSync(skillPath, { recursive: true });
    
    const skillContent = `---
name: ${title}
description: ${description.split('\n')[0]}
---

# ${title}

${description}
`;

    fs.writeFileSync(skillFile, skillContent);
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Failed to create skill:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const resolver = getResolverFromRequest(req);
    const { searchParams } = new URL(req.url);
    const folderName = searchParams.get('folderName');

    if (!folderName) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const skillPath = resolver.skillFolder(folderName);

    // Security: ensure we are within the skills directory
    if (!resolver.isWithinAgent(skillPath)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (!fs.existsSync(skillPath)) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Recursive delete
    fs.rmSync(skillPath, { recursive: true, force: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
