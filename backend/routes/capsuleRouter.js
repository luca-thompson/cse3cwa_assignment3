const express = require('express');
const capsuleRouter = express.Router();
const requireAuth = require("../requireAuth");

capsuleRouter.get('/api/capsules', requireAuth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM capsules WHERE user_id = ?').get(req.user_id).all();

    if (!rows) { return res.status(404).json({ error: 'Couldnt find prompts' }) }
    
    return res.status(200).json(rows);
  }
  catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

capsuleRouter.get('/api/capsules/:id', requireAuth, (req, res) => {

  const id = parseInt(req.params.id);
  
  try {
    const row = db.prepare('SELECT * FROM capsules WHERE user_id = ? AND id = ?').get(req.user_id, id);
    
    if (!row) { return res.status(404).json({ error: 'Couldnt find capsule' }) }
    
    return res.status(200).json(row);
  }
  catch (err) {
    
    return res.status(500).json({ error: 'Internal server error' });
    
  }
});

router.post('/api/capsules', requireAuth, (req, res) => {
  const { project_name, prompt_title, prompt_text } = req.body;
  if (!project_name || !prompt_title || !prompt_text) {
    return res.status(400).json({ error: 'Missing required field' });
  }

  try {
    const result = db
      .prepare(
        `INSERT INTO capsules (
          user_id, project_name, prompt_title, prompt_version, prompt_text,
          response_summary, category, usefulness, reviewed, improved,
          screenshot_url, notes
        ) VALUES (
          @user_id, @project_name, @prompt_title, @prompt_version, @prompt_text,
          @response_summary, @category, @usefulness, @reviewed, @improved,
          @screenshot_url, @notes
        )`
      )
      .run({
        user_id: req.userId,
        project_name,
        prompt_title,
        prompt_version: req.body.prompt_version || null,
        prompt_text,
        response_summary: req.body.response_summary || null,
        category: req.body.category || null,
        usefulness: req.body.usefulness || null,
        reviewed: req.body.reviewed ? 1 : 0,
        improved: req.body.improved ? 1 : 0,
        screenshot_url: req.body.screenshot_url || null,
        notes: req.body.notes || null,
      });
  }
  catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }

  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/api/capsules/:id', requireAuth, (req, res) => {
  try {
    const existing = db
      .prepare('SELECT * FROM capsules WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.userId);
   
    if (!existing) return res.status(404).json({ error: 'Not found' });
    
    db.prepare(
      `UPDATE capsules SET
        project_name = @project_name,
        prompt_title = @prompt_title,
        prompt_version = @prompt_version,
        prompt_text = @prompt_text,
        response_summary = @response_summary,
        category = @category,
        usefulness = @usefulness,
        reviewed = @reviewed,
        improved = @improved,
        screenshot_url = @screenshot_url,
        notes = @notes
      WHERE id = @id AND user_id = @user_id`
    ).run({
      id: req.params.id,
      user_id: req.userId,
      project_name: req.body.project_name ?? existing.project_name,
      prompt_title: req.body.prompt_title ?? existing.prompt_title,
      prompt_version: req.body.prompt_version ?? existing.prompt_version,
      prompt_text: req.body.prompt_text ?? existing.prompt_text,
      response_summary: req.body.response_summary ?? existing.response_summary,
      category: req.body.category ?? existing.category,
      usefulness: req.body.usefulness ?? existing.usefulness,
      reviewed: req.body.reviewed !== undefined ? (req.body.reviewed ? 1 : 0) : existing.reviewed,
      improved: req.body.improved !== undefined ? (req.body.improved ? 1 : 0) : existing.improved,
      screenshot_url: req.body.screenshot_url ?? existing.screenshot_url,
      notes: req.body.notes ?? existing.notes,
    });
  }
  catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
 
  res.json({ success: true });
});

router.delete('/api/capsules/:id', requireAuth, (req, res) => {
  const result = db
    .prepare('DELETE FROM capsules WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.userId);
 
  if (result.changes == 0) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

module.exports = capsuleRouter;
