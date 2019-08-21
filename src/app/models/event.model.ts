export class Event {
  constructor(
    public title: string,
    public start_date: any,
    public end_date: any,
    public location: string,
    public campaign: string,
    public goal: string,
    public whatsapp_link: string,
    public description: string,
    public image: any,
    public noVolunteers: any
  ) {}
}