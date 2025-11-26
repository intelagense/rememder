# Rememder

A Stream Deck plugin that provides a visual reminder indicator. The button displays `_` in its neutral state and changes to `💊` when a reminder time is reached. (Yep, basically a pillminder.) Press the button to reset it until the next reminder cycle.

## Development

```bash
# Build the plugin
npm run build

# Watch mode (auto-rebuild and restart)
npm run watch

# Link plugin to Stream Deck (one-time setup)
streamdeck link

# Restart plugin manually
streamdeck restart com.intelagense.rememder
```

## Configuration

Times are currently hardcoded in `src/actions/rememder.ts`.

## How It Works

- The plugin schedules reminders using setTimeout
- When a scheduled reminder time arrives, the button title automatically changes from `_` to `💊`
- Pressing the button resets the button until the next reminder
