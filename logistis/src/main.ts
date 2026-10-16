import { start } from './server.ts';

const port = Number(process.env.PORT ?? 4747);
start(port).on('error', (e) => { console.error(`Δεν ξεκίνησε στη θύρα ${port}: ${e.message}`); process.exit(1); });
console.log(`N2X: http://localhost:${port}`);
