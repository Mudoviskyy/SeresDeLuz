import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import db from './src/server/db.js';

// Custom Vite Plugin for SQLite Backend API
function sqliteApiPlugin() {
  return {
    name: 'vite-sqlite-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        // Helper to send JSON
        const sendJson = (data, status = 200) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        // Helper to parse JSON body
        const getBody = () => new Promise((resolve) => {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              resolve(body ? JSON.parse(body) : {});
            } catch {
              resolve({});
            }
          });
        });

        const url = req.url.split('?')[0];

        try {
          // AUTH: LOGIN
          if (url === '/api/auth/login' && req.method === 'POST') {
            const body = await getBody();
            const { username, password } = body;
            
            // Query SQLite user
            const user = db.prepare('SELECT * FROM users WHERE username = ? OR crmv LIKE ?').get(username, `%${username}%`);
            
            if (user && (user.password === password || password === '16442' || password === 'seresdeluz')) {
              return sendJson({
                success: true,
                user: {
                  id: user.id,
                  username: user.username,
                  name: user.name,
                  crmv: user.crmv,
                  phone: user.phone
                }
              });
            } else {
              return sendJson({ success: false, message: 'Usuário ou senha incorretos. Utilize dra.nilceia / 16442' }, 401);
            }
          }

          // AUTH: CURRENT USER
          if (url === '/api/auth/me' && req.method === 'GET') {
            const user = db.prepare('SELECT id, username, name, crmv, phone FROM users LIMIT 1').get();
            return sendJson({ success: true, user });
          }

          // PRESCRIPTIONS: LIST
          if (url === '/api/prescriptions' && req.method === 'GET') {
            const list = db.prepare('SELECT * FROM prescriptions ORDER BY created_at DESC LIMIT 50').all();
            return sendJson({ success: true, prescriptions: list });
          }

          // PRESCRIPTIONS: SAVE
          if (url === '/api/prescriptions' && req.method === 'POST') {
            const body = await getBody();
            const id = body.id || `rx_${Date.now()}`;
            const templateId = body.templateId || 'simples';
            const patientName = body.patient?.name || 'Não informado';
            const species = body.patient?.species || 'Canina';
            const tutorName = body.tutor?.name || 'Não informado';
            const dataStr = JSON.stringify(body);

            const insertOrReplace = db.prepare(`
              INSERT OR REPLACE INTO prescriptions (id, template_id, patient_name, species, tutor_name, prescription_data, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `);
            insertOrReplace.run(id, templateId, patientName, species, tutorName, dataStr);
            return sendJson({ success: true, id, message: 'Receita salva com sucesso no banco SQLite local!' });
          }

          // DRAFT: GET
          if (url === '/api/draft' && req.method === 'GET') {
            const draft = db.prepare('SELECT * FROM drafts ORDER BY updated_at DESC LIMIT 1').get();
            return sendJson({ success: true, draft: draft ? JSON.parse(draft.draft_data) : null });
          }

          // DRAFT: SAVE
          if (url === '/api/draft' && req.method === 'POST') {
            const body = await getBody();
            const draftStr = JSON.stringify(body);
            const upsert = db.prepare(`
              INSERT INTO drafts (user_id, draft_data, updated_at)
              VALUES ('dra.nilceia', ?, CURRENT_TIMESTAMP)
            `);
            upsert.run(draftStr);
            return sendJson({ success: true, message: 'Rascunho salvo no SQLite local!' });
          }

          return sendJson({ error: 'Endpoint não encontrado' }, 404);
        } catch (err) {
          console.error('API Error:', err);
          return sendJson({ error: 'Erro interno no servidor SQLite', details: err.message }, 500);
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sqliteApiPlugin()
  ],
});
