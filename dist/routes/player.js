import { Router } from 'express';
import { supabaseAnon } from '../supabase.js';
const router = Router();
function requireUser(req, res, next) {
    if (!req.userId)
        return res.status(401).json({ error: 'Missing or invalid token' });
    next();
}
router.get('/', requireUser, async (req, res) => {
    const userId = req.userId;
    const { data, error } = await supabaseAnon
        .from('players')
        .select('id, data, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error)
        return res.status(500).json({ error: error.message });
    return res.json({ player: data?.data ?? null });
});
router.post('/', requireUser, async (req, res) => {
    const userId = req.userId;
    const body = req.body;
    if (!body || typeof body.data !== 'object')
        return res.status(400).json({ error: 'Missing data object' });
    const payload = { user_id: userId, data: body.data, updated_at: new Date().toISOString() };
    const { data, error } = await supabaseAnon
        .from('players')
        .upsert(payload, { onConflict: 'user_id' })
        .select('id, data, updated_at')
        .maybeSingle();
    if (error)
        return res.status(500).json({ error: error.message });
    return res.json({ player: data });
});
export default router;
