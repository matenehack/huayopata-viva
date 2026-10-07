import {useEffect,useRef} from 'react';
import './botanical-trace.css';

// Ilustraciones editoriales estilizadas; no son fichas de identificación botánica.
const strokes={
 te:'M35 190 C48 154 63 117 91 53 M55 142 C23 139 14 114 18 94 C48 94 62 113 55 142 M55 142 L24 101 M72 106 C77 78 99 68 121 72 C114 98 96 112 72 106 M72 106 L112 79 M86 72 C66 63 65 37 74 19 C92 34 100 53 86 72 M86 72 L77 29 M42 170 C66 147 91 148 112 160 C91 177 65 183 42 170 M42 170 L101 162',
 cafe:'M30 192 C48 158 65 120 93 48 M51 151 C20 145 14 121 22 100 C47 103 64 126 51 151 M51 151 L28 110 M73 106 C79 80 102 74 126 83 C115 108 94 117 73 106 M73 106 L115 87 M86 70 C67 59 66 34 77 17 C97 31 101 53 86 70 M86 70 L79 28 M53 149 C71 146 87 148 99 160 M99 160 C91 149 92 137 102 132 C115 130 123 142 116 153 C111 160 105 163 99 160 M97 176 C87 169 87 159 96 154 C107 151 116 161 111 170 C108 177 102 180 97 176'
};
export default function BotanicalTrace({kind}:{kind:'te'|'cafe'}){
 const art=useRef<SVGSVGElement>(null);
 useEffect(()=>{
  const node=art.current;if(!node)return;
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const section=node.closest('.hv-process-explorer');
  let observer:IntersectionObserver|undefined;
  const finish=()=>{node.dataset.drawn='true';node.classList.remove('is-drawing');observer?.disconnect()};
  const change=()=>{if(preference.matches)finish()};
  const hidden=()=>{if(document.hidden)finish()};
  if(!preference.matches&&'IntersectionObserver' in window){
   observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){node.classList.add('is-drawing');observer?.disconnect()}},{threshold:.3});observer.observe(node);
  }
  node.addEventListener('animationend',finish);
  section?.addEventListener('focusin',finish);
  section?.addEventListener('pointerdown',finish);
  preference.addEventListener('change',change);document.addEventListener('visibilitychange',hidden);
  return()=>{observer?.disconnect();node.classList.remove('is-drawing');node.removeEventListener('animationend',finish);section?.removeEventListener('focusin',finish);section?.removeEventListener('pointerdown',finish);preference.removeEventListener('change',change);document.removeEventListener('visibilitychange',hidden)};
 },[]);
 return <svg ref={art} className={`hv-botanical-trace hv-botanical-${kind}`} viewBox="0 0 150 210" aria-hidden="true" focusable="false"><path d={strokes[kind]} pathLength="1"/></svg>;
}
