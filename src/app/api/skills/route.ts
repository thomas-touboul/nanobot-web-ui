import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const SKILLS_ROOT = '/home/moltbot/.openclaw/skills';

export async function GET() {
  if (!fs.existsSync(SKILLS_ROOT)) {
    return NextResponse.json([]);
  }

  try {
    const entries = fs.readdirSync(SKILLS_ROOT, { withFileTypes: true });
    const skills = entries
      .filter((entry) => entry.isDirectory())
      .map((dir) => {
        const skillPath = path.join(SKILLS_ROOT, dir.name, 'SKILL.md');
        let name = dir.name;
        let description = '';

        if (fs.existsSync(skillPath)) {
          const content = fs.readFileSync(skillPath, 'utf-8');
          
          // Simple regex to parse frontmatter or basic YAML-like structure
          const nameMatch = content.match(/^name:\s*(.+)$/m);
          const descMatch = content.match(/^description:\s*(.+)$/m);

          if (nameMatch) name = nameMatch[1].trim();
          if (descMatch) description = descMatch[1].trim();
        }

        return {
          folderName: dir.name,
          name,
          description,
        };
      });

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error reading skills:', error);
    return NextResponse.json({ error: 'Failed to list skills' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { folderName, content } = await request.json();
    
    if (!folderName || !folderName.match(/^[a-z0-9-]+$/)) {
      return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 });
    }

    const skillDir = path.join(SKILLS_ROOT, folderName);
    const skillFile = path.join(skillDir, 'SKILL.md');

    if (fs.existsSync(skillDir)) {
      return NextResponse.json({ error: 'Skill already exists' }, { status: 400 });
    }

    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(skillFile, content, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderName = searchParams.get('folderName');

    if (!folderName || folderName.includes('..') || folderName.includes('/') || folderName.includes('\\')) {
      return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 });
    }

    const skillDir = path.join(SKILLS_ROOT, folderName);

    if (!fs.existsSync(skillDir)) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Security check to ensure we are deleting within SKILLS_ROOT
    if (!skillDir.startsWith(SKILLS_ROOT)) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    fs.rmSync(skillDir, { recursive: true, force: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
