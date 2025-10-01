import fs from 'fs';
import path from 'path';

export function loadRequiredEnvKeysFromExample(): string[] {
    const filePath = path.resolve(process.cwd(), '.env.example');
    if (!fs.existsSync(filePath)) {
        return [];
    }

    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    const requiredKeys: string[] = [];

    content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.length === 0) return;
        if (trimmed.startsWith('#')) return;

        const noInlineComment = trimmed.split('#')[0].trim();
        if (noInlineComment.length === 0) return;

        const eqIndex = noInlineComment.indexOf('=');
        if (eqIndex <= 0) return;

        const key = noInlineComment.substring(0, eqIndex).trim();

        const isOptional = /#\s*optional/i.test(trimmed);
        if (!isOptional && key.length > 0) {
            requiredKeys.push(key);
        }
    });

    return requiredKeys;
}

export function validateEnvOrExit(): void {

    const requiredKeys = loadRequiredEnvKeysFromExample();
    const missing = requiredKeys.filter((key) => {
        const value = process.env[key];
        return typeof value !== 'string' || value.trim().length === 0;
    });

    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
}


