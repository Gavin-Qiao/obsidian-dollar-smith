import * as fs from 'fs';
import * as path from 'path';

export function readFixture(filename: string): string {
    return fs.readFileSync(path.join(__dirname, 'fixtures', filename), 'utf8');
}
