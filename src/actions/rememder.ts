import {
	action,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
} from "@elgato/streamdeck";

const REMINDER_TIMES = ["07:00", "11:00", "19:00"];

@action({ UUID: "com.intelagense.rememder.reminder" })
class Rememder extends SingletonAction {
	private isOn = false;
	private timeoutId?: NodeJS.Timeout;

	override async onWillAppear(ev: WillAppearEvent) {
		this.isOn = false;
		await this.updateKey(ev);
		this.scheduleNextTrigger(ev);
	}

	private scheduleNextTrigger(ev: WillAppearEvent | KeyDownEvent) {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}

		const nextDueDate = this.findNextDueDate();
		if (!nextDueDate) return;

		const msUntilTrigger = nextDueDate.getTime() - Date.now();

		this.timeoutId = setTimeout(async () => {
			this.isOn = true;
			await this.updateKey(ev);
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

	override async onKeyDown(ev: KeyDownEvent) {
		this.isOn = false;
		await this.updateKey(ev);
		this.scheduleNextTrigger(ev);
	}


	private async updateKey(ev: WillAppearEvent | KeyDownEvent) {
		if (this.isOn) {
			await ev.action.setTitle("💊");
		} else {
			await ev.action.setTitle("_");
		}
	}
}

export { Rememder };