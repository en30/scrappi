export type BackgroundMessageType = "SCRAP";
export type BackgroundMessage = {
  type: BackgroundMessageType;
};

export const scrap = (): BackgroundMessage => ({ type: "SCRAP" });

export type ScrapboxMessageType = "LOAD";
export type ScrapboxMessage = {
  type: ScrapboxMessageType;
};

export const load = (): ScrapboxMessage => ({ type: "LOAD" });
