import {
	action,
	KeyUpEvent,
	SingletonAction,
	WillAppearEvent,
} from "@elgato/streamdeck";

const REMINDER_TIMES = ["7:00", "11:00", "19:00"];

@action({ UUID: "com.intelagense.rememder.reminder" })
class Rememder extends SingletonAction {
	private timeoutId?: NodeJS.Timeout;

	override async onWillAppear(ev: WillAppearEvent) {
		const settings = await ev.action.getSettings();
		const lastState = settings.state === 1 ? 1 : 0;
		
		for (const action of this.actions) {
			if (action.isKey()) {
				await action.setState(lastState);
			}
		}
		
		this.scheduleNextTrigger();
	}

	override async onKeyUp(ev: KeyUpEvent) {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
		
		for (const action of this.actions) {
			if (action.isKey()) {
				await action.setState(0);
				await action.setSettings({ state: 0 });
			}
		}
		
		this.scheduleNextTrigger();
	}

	private scheduleNextTrigger() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}

		const nextDueDate = this.findNextDueDate();
		if (!nextDueDate) return;

		const msUntilTrigger = nextDueDate.getTime() - Date.now();

		this.timeoutId = setTimeout(async () => {
			for (const action of this.actions) {
				if (action.isKey()) {
					await action.setState(1);
					await action.setSettings({ state: 1 });
				}
			}
			this.scheduleNextTrigger();
		}, msUntilTrigger);
	}

	private findNextDueDate(): Date | null {
		if (REMINDER_TIMES.length === 0) return null;

		const now = new Date();
		let startingDueDate: Date | null = null;

		for (const timeStr of REMINDER_TIMES) {
			const [h, m] = timeStr.split(":").map(Number);
			const dueDate = new Date();
			dueDate.setHours(h, m, 0, 0);

			if (startingDueDate === null) {
				startingDueDate = dueDate;
			}

			if (dueDate > now) {
				return dueDate;
			}
		}

		return new Date(startingDueDate!.getTime() + 86400000);
	}

	override onWillDisappear() {
		if (this.timeoutId) clearTimeout(this.timeoutId);
	}
}

export { Rememder };
