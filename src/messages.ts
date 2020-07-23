export type BackgroundMessageType = "SCRAP";
export type BackgroundMessage = {
  type: BackgroundMessageType;
};

export type ScrapboxMessageType = "LOAD";
export type ScrapboxMessage = {
  type: ScrapboxMessageType;
};

export const load = (): ScrapboxMessage => ({ type: "LOAD" });
