import { Router } from 'express';
import { supabaseAdmin } from '../supabase.js';
const router = Router();
router.get('/', async (_req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('game_data')
            .select('id, type, data');
        if (error)
            return res.status(500).json({ error: error.message });
        const out = {};
        for (const row of data) {
            if (!out[row.type])
                out[row.type] = [];
            out[row.type].push(row.data);
        }
        return res.json({ data: out });
    }
    catch (err) {
        return res.status(500).json({ error: String(err) });
    }
});
export default router;
