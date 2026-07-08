import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
    const db = await open({
        filename: './mipc.db',
        driver: sqlite3.Database
    });
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("Tables:", tables.map(t => t.name));
    for (const t of tables) {
        if (t.name.includes('backup')) continue;
        const schema = await db.all(`PRAGMA table_info(${t.name})`);
        console.log(`Schema for ${t.name}:`, schema.map(s => `${s.name} (${s.type})`));
    }
})();
