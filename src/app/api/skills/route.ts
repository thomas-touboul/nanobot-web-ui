import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

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
