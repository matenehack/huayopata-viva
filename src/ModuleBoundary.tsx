import {Component,type ReactNode} from 'react';
import {sitePath} from './lib/site';
export default class ModuleBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<section className="hv-module-error" role="alert"><h3>El directorio no pudo abrirse.</h3><p>La página y sus historias siguen disponibles. Recarga para volver a intentar el directorio; también puedes consultar la copia de datos y contactos.</p><button className="hv-action hv-action-dark" onClick={()=>window.location.reload()}>Reintentar carga</button><a href={sitePath('/servicios-huayopata.json')} download>Descargar datos y contactos ↓</a></section>:this.props.children}
}
