import 'dotenv/config'
import app from './app.js';
import connectDB from './config/db.js';
import { bootstrapAdmin } from './bootstrap/bootstrapAdmin.js';

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
await connectDB();

await bootstrapAdmin();

app.listen(port,hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})

