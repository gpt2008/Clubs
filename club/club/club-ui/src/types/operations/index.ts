import { MultipleCancellationOperation, MultipleCancellationResponse } from "./Appointment";

export default interface BaseOperation {
	type: string;
}

export type { MultipleCancellationOperation, MultipleCancellationResponse };
