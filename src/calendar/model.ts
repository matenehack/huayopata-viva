export const categories=['Cultura','Religión','Educación','Institucional','Producción','Gastronomía','Deportes','Comunidad'] as const;
export const statuses=['Tradición documentada','Programa pendiente','Programa confirmado','Reprogramado','Cancelado','Finalizado'] as const;
export type Category=typeof categories[number];
export type Status=typeof statuses[number];
export type Source={label:string;url:string;kind:string;accessedAt:string};
export type DateRule={kind:'annual'|'nth-weekday'|'unknown'|'one-off';month?:number;day?:number;weekday?:number;nth?:number;start?:string;end?:string};
export type Event={id:string;slug:string;title:string;category:Category;locality:string;organizerId:string;institutionId:string|null;dateRule:DateRule;status:Status;summary:string;history:string;editorialNote:string;sources:Source[];updatedAt:string;photoPending:boolean;relatedTopic:string;location:{lat:number;lng:number;label:string;source:string}|null;editions:{year:number;description:string;source:string}[];published:boolean;editionYear?:number};
export type Activity={id:string;eventId:string;name:string;date:string|null;time:string|null;place:string;description:string;category:Category;organizerId:string;status:Status;source:string;published:boolean};
export type Media={contextOnly?:boolean;id:string;eventId:string;kind:'image'|'video';url:string;mobileUrl?:string;alt:string;represented:string;author:string;source:string;license:string;licenseUrl:string;authorization:string;transformation:string;year:number;published:boolean};
export type Organizer={id:string;name:string;url:string|null};
export type Institution={id:string;name:string;modularCode:string;locality:string;level:string;anniversary:string|null;anniversaryStatus:string;sources:Source[];updatedAt:string;note:string};
export type CalendarData={events:Event[];activities:Activity[];media:Media[];organizers:Organizer[];institutions:Institution[];updatedAt:string};
export const dateKey=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function occurrence(event:Event,year:number):Date|null{
 const r=event.dateRule;
 if(r.kind==='unknown')return null;
 if(r.kind==='one-off'){if(!r.start)return null;const d=new Date(r.start+'T12:00:00');return d.getFullYear()===year?d:null}
 if(!r.month)return null;
 if(r.kind==='annual'){if(!r.day)return null;const d=new Date(year,r.month-1,r.day,12);return d.getMonth()===r.month-1?d:null}
 if(r.weekday===undefined||!r.nth)return null;
 const first=new Date(year,r.month-1,1,12);const day=1+(r.weekday-first.getDay()+7)%7+7*(r.nth-1);const d=new Date(year,r.month-1,day,12);return d.getMonth()===r.month-1?d:null;
}
export function nextOccurrence(event:Event,now=new Date()):Date|null{
 const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 if(event.dateRule.kind==='one-off'&&event.dateRule.start&&event.dateRule.end&&event.dateRule.start<=dateKey(today)&&event.dateRule.end>=dateKey(today))return new Date(event.dateRule.start+'T12:00:00');
 for(let y=today.getFullYear();y<=today.getFullYear()+4;y++){const d=occurrence(event,y);if(d&&d>=today)return d}return null;
}
export const formatDate=(date:Date)=>date.toLocaleDateString('es-PE',{day:'numeric',month:'long',year:'numeric'});
export function dateLabel(e:Event,year=new Date().getFullYear()){
 const d=occurrence(e,year);return d?formatDate(d)+(e.dateRule.kind==='one-off'&&e.dateRule.end&&e.dateRule.end!==e.dateRule.start?' – '+formatDate(new Date(e.dateRule.end+'T12:00:00')):''):'Fecha por confirmar';
}
// Confirmation belongs to a particular edition, never to every annual recurrence.
export function editionStatus(e:Event,year:number):Status{
 if(['Programa confirmado','Reprogramado','Cancelado','Finalizado'].includes(e.status)&&e.editionYear!==year&&e.dateRule.kind!=='one-off')return 'Programa pendiente';return e.status;
}

export function occursOn(e:Event,d:Date){
 if(e.dateRule.kind==='one-off'&&e.dateRule.start){const key=dateKey(d);return key>=e.dateRule.start&&key<=(e.dateRule.end||e.dateRule.start)}
 const start=occurrence(e,d.getFullYear());return !!start&&dateKey(start)===dateKey(d);
}
export function datesInMonth(e:Event,year:number,month:number){return Array.from({length:new Date(year,month+1,0).getDate()},(_,i)=>new Date(year,month,i+1,12)).filter(d=>occursOn(e,d));}

export function localityNames(e:Event){return e.locality.split(' · ').filter(l=>l!=='referencia nacional').map(l=>l.toLocaleLowerCase('es')==='distrito de huayopata'?'Distrito de Huayopata':l);}
