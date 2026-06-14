require('dotenv').config();
const { App } = require('@slack/bolt');

// Initialisation du bot
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});

// ══════════════════════════════════════════
// COMMANDE /hello
// ══════════════════════════════════════════
app.command('/hello', async ({ command, ack, say }) => {
  await ack();
  console.log(`[COMMANDE] /hello reçue de ${command.user_name}`);
  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `👋 *Bonjour <@${command.user_id}> !*\nJe suis MyBot, votre assistant Slack. Comment puis-je vous aider ?`
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Commandes disponibles :*\n• `/hello` — Salutation\n• `/help` — Aide\n• Mentionnez-moi avec `@MyBot`'
        }
      }
    ]
  });
});

// ══════════════════════════════════════════
// COMMANDE /help
// ══════════════════════════════════════════
app.command('/help', async ({ command, ack, say }) => {
  await ack();
  console.log(`[COMMANDE] /help reçue de ${command.user_name}`);
  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `🤖 *Aide MyBot*\n\nVoici ce que je peux faire :`
        }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: '*/hello*\nSaluer le bot' },
          { type: 'mrkdwn', text: '*/help*\nAfficher cette aide' }
        ]
      }
    ]
  });
});

// ══════════════════════════════════════════
// RÉPONSE AUX MENTIONS (@MyBot)
// ══════════════════════════════════════════
app.event('app_mention', async ({ event, say }) => {
  console.log(`[MENTION] ${event.user} a mentionné le bot : "${event.text}"`);
  await say({
    text: `Bonjour <@${event.user}> ! 👋 Vous m'avez mentionné. Tapez \`/hello\` pour commencer.`,
    thread_ts: event.ts
  });
});

// ══════════════════════════════════════════
// LOG DES MESSAGES DU CANAL
// ══════════════════════════════════════════
app.event('message', async ({ event }) => {
  if (event.subtype) return; // Ignorer les messages système
  console.log(`[MESSAGE] Canal: ${event.channel} | Utilisateur: ${event.user} | Texte: "${event.text}" | Timestamp: ${new Date(event.ts * 1000).toISOString()}`);
});

// ══════════════════════════════════════════
// DÉMARRAGE DU BOT
// ══════════════════════════════════════════
(async () => {
  try {
    await app.start();
    console.log('✅ MyBot est démarré en mode Socket !');
    console.log('📡 En attente de messages et commandes...');
  } catch (error) {
    console.error('❌ Erreur au démarrage :', error);
    process.exit(1);
  }
})();