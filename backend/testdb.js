const connectDB = require('./config/db'); (async()=>{ try{ await connectDB(); console.log('CONNECT OK'); process.exit(0);}catch(e){ console.error('CONNECT ERR', e); process.exit(1);} })();
