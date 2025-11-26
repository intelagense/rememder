import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { Rememder } from "./actions/rememder";

streamDeck.logger.setLevel(LogLevel.TRACE);

streamDeck.actions.registerAction(new Rememder());
streamDeck.connect();
