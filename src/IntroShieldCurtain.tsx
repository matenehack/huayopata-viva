import {useEffect,useState} from 'react';
import {sitePath} from './lib/site';

// Activate only after a municipal source and approved local asset are recorded.
export const municipalShield: {path:string;source:string}|null = {path:"assets/identity/escudo-huayopata.webp",source:"https://www.gob.pe/munihuayopata"};
export default function IntroShieldCurtain(){
 const [visible,setVisible]=useState(false);
 useEffect(()=>{
  if(!municipalShield||location.hash||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  try{if(sessionStorage.getItem('hv-intro-seen'))return;sessionStorage.setItem('hv-intro-seen','1')}catch{return}
  setVisible(true);
  const timeout=window.setTimeout(()=>setVisible(false),2200);
  return()=>window.clearTimeout(timeout);
 },[]);
 if(!visible||!municipalShield)return null;
 return <div className="hv-intro-curtain" aria-hidden="true"><img src={sitePath(municipalShield.path)} alt="" onError={()=>setVisible(false)}/><strong>HUAYOPATA VIVA</strong><span>Donde los Andes se vuelven valle</span></div>;
}
