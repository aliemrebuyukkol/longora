/* Lóngora: dependency-free orthographic 3D diorama renderer. */
(function(){
'use strict';
const V=(x=0,y=0,z=0)=>[x,y,z],add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,k)=>a.map(v=>v*k),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>mul(a,1/(Math.hypot(...a)||1)),clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const configs=[
['#79a16b','#b44c33','#d7ad57','#775234','Dağ ve bulutlar','staff'],['#9daec3','#8d79ab','#e9d9ac','#34363e','Ay bahçesi','rabbit'],['#bda269','#bc4939','#efbd63','#303639','Lotus geçidi','wheel'],['#94ad77','#4d9985','#e6ca87','#353a32','Renkli taşlar','stones'],['#8c9e7d','#87603c','#e2c58e','#493a2d','İlk dağlar','axe'],['#c4a46d','#ad653b','#f4c872','#37372e','Güneş vadisi','bow'],
['#b6a36e','#c35042','#f3d88a','#333337','Güneş mağarası','mirror'],['#6f9893','#4c7182','#e0d4a5','#333a40','Izumo nehri','sword'],['#8795b5','#7e83af','#ded8ad','#303747','Gece denizi','moon'],['#80aaa0','#507e83','#e8d0a2','#343c36','Göksel köprü','spear'],['#bd969d','#ad677e','#e9caa1','#41303c','İlk adalar','plant'],['#92ac78','#64886a','#f0d5a0','#343d34','Inaba kıyısı','hare']];
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const color=(h,k)=>'rgb('+rgb(h).map(x=>Math.round(clamp(x*k,0,255))).join(',')+')';
let faces=[],group='ground';
function face(p,c,center){let n=norm(cross(sub(p[1],p[0]),sub(p[2],p[0])));if(Math.hypot(...n)<.01)return;let m=mul(p.reduce(add,V()),1/p.length);if(center&&dot(n,sub(m,center))<0){p=p.slice().reverse();n=mul(n,-1)}faces.push({p,n,c,g:group,t:.94+((faces.length*37)%13)/100})}
function ell(c,r,paint,seg=10,rings=6){const p=(j,i)=>{const a=Math.PI*j/rings,b=Math.PI*2*i/seg;return add(c,V(r[0]*Math.sin(a)*Math.cos(b),r[1]*Math.cos(a),r[2]*Math.sin(a)*Math.sin(b)))};for(let j=0;j<rings;j++)for(let i=0;i<seg;i++){let a=p(j,i),b=p(j,i+1),d=p(j+1,i),e=p(j+1,i+1);if(j===0)face([a,d,e],paint,c);else if(j===rings-1)face([a,d,b],paint,c);else{face([a,d,b],paint,c);face([b,d,e],paint,c)}}}
function tube(a,b,r1,r2,c,seg=8){let axis=norm(sub(b,a)),u=norm(cross(axis,Math.abs(axis[1])>.9?V(1,0,0):V(0,1,0))),v=cross(axis,u),m=mul(add(a,b),.5);const ring=(p,r)=>Array.from({length:seg},(_,i)=>add(p,add(mul(u,r*Math.cos(i*2*Math.PI/seg)),mul(v,r*Math.sin(i*2*Math.PI/seg)))));let A=ring(a,r1),B=ring(b,r2);for(let i=0;i<seg;i++){let j=(i+1)%seg;face([A[i],A[j],B[j],B[i]],c,m)}face(A,c,m);face(B,c,m)}
function box(c,s,paint){let p=[];for(let x of [-1,1])for(let y of [-1,1])for(let z of [-1,1])p.push(add(c,V(x*s[0]/2,y*s[1]/2,z*s[2]/2)));for(let ids of [[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]])face(ids.map(i=>p[i]),paint,c)}
function torus(c,R,r,paint,plane='xy',segments=14){const p=(i,j)=>{let a=i*2*Math.PI/segments,b=j*2*Math.PI/5;let x=(R+r*Math.cos(b))*Math.cos(a),y=(R+r*Math.cos(b))*Math.sin(a),z=r*Math.sin(b);return add(c,plane==='xz'?V(x,z,y):V(x,y,z))};for(let i=0;i<segments;i++)for(let j=0;j<5;j++){let a=(i+.5)*2*Math.PI/segments,m=add(c,plane==='xz'?V(R*Math.cos(a),0,R*Math.sin(a)):V(R*Math.cos(a),R*Math.sin(a),0));face([p(i,j),p(i+1,j),p(i+1,j+1),p(i,j+1)],paint,m)}}
function chain(points,r,c){for(let i=1;i<points.length;i++)tube(points[i-1],points[i],r,r,c,6)}
function tree(x,z,s,c,blossom=false){tube(V(x,.05,z),V(x,1.05*s,z),.1*s,.07*s,'#795743',6);for(let j=0;j<3;j++){let a=j*2.1;ell(V(x+Math.cos(a)*.23*s,(.95+j*.19)*s,z+Math.sin(a)*.23*s),V(.5*s,.43*s,.45*s),blossom?'#dba4ac':c,7,4)}}
function rock(x,z,h,c){tube(V(x,.04,z),V(x+.15,h,z-.12),h*.52,.025,c,5)}
function rabbit(x,y,z,s){ell(V(x,y+.24*s,z),V(.3*s,.28*s,.4*s),'#f2e5cc',8,5);ell(V(x,y+.53*s,z+.22*s),V(.24*s,.24*s,.23*s),'#fff1db',8,5);for(let a of [-1,1]){ell(V(x+a*.13*s,y+.82*s,z+.22*s),V(.07*s,.29*s,.08*s),'#f8ead8',6,4);ell(V(x+a*.13*s,y+.83*s,z+.286*s),V(.035*s,.19*s,.018*s),'#dba6a0',5,3);ell(V(x+a*.12*s,y+.57*s,z+.41*s),V(.026*s,.035*s,.022*s),'#463e39',5,3)}ell(V(x,y+.23*s,z-.4*s),V(.12*s,.12*s,.12*s),'#fff1db',6,4)}
function lotus(x,z,c='#e5a5ae'){for(let j=0;j<7;j++){let a=j*2*Math.PI/7;ell(V(x+Math.cos(a)*.19,.12,z+Math.sin(a)*.19),V(.14,.15,.14),c,6,3)}ell(V(x,.15,z),V(.12,.09,.12),'#e9c46b',6,3)}
function gate(x,z,c='#b34f3c'){for(let side of [-1,1])tube(V(x+side*.63,.02,z),V(x+side*.59,1.55,z),.085,.07,c,7);box(V(x,1.43,z),V(1.7,.13,.18),c);box(V(x,1.7,z),V(1.9,.17,.24),c);box(V(x,1.83,z),V(2,.09,.27),'#463e39')}
function bridge(x,z){for(let j=0;j<9;j++){let t=j/8;box(V(x-1.15+t*2.3,.17+Math.sin(t*Math.PI)*.38,z),V(.28,.1,.58),'#aa7651')}for(let a of [-1,1])chain(Array.from({length:9},(_,j)=>V(x-1.15+j/8*2.3,.47+Math.sin(j/8*Math.PI)*.38,z+a*.32)),.055,'#e0ad70')}
function build(i){faces=[];group='ground';const [land,robe,gold,hair]=configs[i],skin=i===0?'#e3b27f':'#ecc29c',female=[1,3,6,10].includes(i),water=[1,7,8,9,10,11].includes(i);
tube(V(0,-.68,0),V(0,-.22,0),2.45,2.78,'#79644e',10);tube(V(0,-.22,0),V(0,.02,0),2.78,2.8,land,10);
if(water){ell(V(-.92,.025,.45),V(1.38,.05,.68),'#79b1b6',14,3);for(let k=0;k<3;k++)torus(V(-.85,.08,.48),.25+k*.23,.013,'#c7dfd4','xz',16)}
if([0,4,5].includes(i)){rock(-1.7,-1.1,1.5,'#708879');rock(1.45,-1.3,1.1,'#8e9e81')}
if(i===6){rock(-1.75,-.7,1.3,'#68625a');rock(-1.35,-1.35,1.6,'#7d7261');box(V(-1.55,1.13,-.85),V(.9,.38,.6),'#7a6a56')}
if([6,7,10,11].includes(i))gate(1.45,-1.05);
if([9,10].includes(i))bridge(-.95,.45);
if(i===2||i===3){lotus(-1.6,.7);lotus(1.5,.8);lotus(-1.25,-.65)}
if(i!==8){tree(-1.65,-1.45,.85,'#759665',i===6||i===10);tree(1.75,-.75,.78,'#789d70',i===10);if(i===0)tree(1.3,-1.7,1.1,'#739663')}
if(i===8||i===1){ell(V(-1.5,1.85,-1.2),V(.43,.43,.43),'#ead9ac',12,7)}
if(i===5){for(let j=0;j<10;j++){group=j===0?'ground':'sun-extra';let a=j*2*Math.PI/10;ell(V(Math.cos(a)*2.05,1.85+.23*Math.sin(j),Math.sin(a)*2.05),V(.15,.15,.15),'#eabf68',7,4)}group='ground'}
for(let j=0;j<8;j++){let a=j*2*Math.PI/8;rock(Math.cos(a)*2.48,Math.sin(a)*2.48,.12+(j%3)*.05,'#a9a180')}
group='body';const waist=1.34,shoulder=2.35;
if(female){tube(V(0,.18,0),V(0,waist,0),.66,.35,robe,10);tube(V(0,waist,0),V(0,shoulder,0),.36,.48,robe,10);torus(V(0,waist+.05,0),.37,.06,gold,'xz')}
else{for(let a of [-1,1]){tube(V(a*.26,.22,0),V(a*.25,1.02,0),.18,.23,'#303f3d',7);ell(V(a*.26,.17,.14),V(.23,.15,.36),'#283532',8,4)}tube(V(0,.85,0),V(0,shoulder,0),.48,.51,robe,10);torus(V(0,1.31,0),.49,.075,gold,'xz')}
tube(V(0,2.28,0),V(0,2.58,0),.18,.19,skin,8);
for(let a of [-1,1]){chain([V(a*.42,2.3,.23),V(0,1.92,.49),V(a*.28,1.69,.45)],.035,gold);for(let k=0;k<3;k++)ell(V(a*.31,1.48+k*.14,.47),V(.04,.04,.025),gold,5,3)}
group='head';ell(V(0,2.9,0),V(.63,.69,.56),hair,12,7);ell(V(0,2.85,.23),V(.53,.53,.4),skin,12,7);
for(let a of [-1,1]){ell(V(a*.23,2.94,.57),V(.052,.073,.032),'#263633',7,4);ell(V(a*.32,2.8,.51),V(.082,.035,.024),'#d48f78',6,3);tube(V(a*.17,3.06,.55),V(a*.30,3.08,.50),.027,.027,hair,6)}
ell(V(0,2.84,.64),V(.07,.08,.07),'#d59c7c',7,4);chain([V(-.11,2.69,.53),V(0,2.67,.57),V(.11,2.69,.53)],.018,'#895646');
if(i===0){for(let a of [-1,1]){ell(V(a*.61,2.91,0),V(.23,.23,.15),hair,8,5);ell(V(a*.63,2.91,.09),V(.13,.13,.06),skin,7,4)}torus(V(0,3.15,0),.56,.065,gold,'xz');ell(V(0,3.22,.53),V(.13,.13,.06),gold,8,4)}
else if(i===2){for(let a of [-1,1])ell(V(a*.47,3.47,-.05),V(.24,.25,.24),hair,8,5)}
else if(i===6){torus(V(0,3.23,0),.55,.065,gold,'xz');for(let j=0;j<7;j++){let a=(j-3)*.32;tube(V(Math.sin(a)*.47,3.28,.07),V(Math.sin(a)*.95,3.83-.14*Math.abs(j-3),.07),.043,.013,gold,5)}}
else if(i===8){torus(V(0,3.17,0),.55,.04,gold,'xz');ell(V(0,3.53,.12),V(.17,.2,.1),gold,7,5)}
else{ell(V(0,3.47,-.12),V(.28,.23,.28),hair,8,5);torus(V(0,3.29,0),.38,.04,gold,'xz')}
if(female)for(let a of [-1,1])ell(V(a*.47,2.42,-.19),V(.18,.56,.19),hair,7,5);
if(i===4)ell(V(0,2.51,.36),V(.36,.27,.27),hair,9,5);
for(let a of [-1,1]){group=a===1?'right':'left';const A=V(a*.44,2.25,0),B=V(a*.83,1.84,.08),C=V(a*.98,1.65,.22);tube(A,B,.24,.20,robe,8);tube(B,C,.2,.15,robe,8);torus(C,.14,.045,gold,'xz',10);ell(add(C,V(0,-.11,.03)),V(.15,.18,.15),skin,8,5)}
group='right';let p=V(.98,1.57,.25);
if([0,4,7,9].includes(i)){let tip=i===0?3.55:3.32;tube(V(1.05,.18,.3),V(1.05,tip,.3),.065,.065,i===0?'#ae4937':'#896345',8);if(i===0){tube(V(1.05,3.23,.3),V(1.05,3.57,.3),.09,.09,gold,8);tube(V(1.05,.18,.3),V(1.05,.45,.3),.09,.09,gold,8)}if(i===4)box(V(1.22,3.18,.3),V(.52,.36,.13),'#c3d3cc');if(i===7){tube(V(1.05,1.9,.3),V(1.05,3.4,.3),.11,.025,'#d2e0dc',4);box(V(1.05,1.89,.3),V(.42,.09,.17),gold)}if(i===9)tube(V(1.05,3.2,.3),V(1.05,3.65,.3),.18,0,'#d1dfd7',5)}
if(i===5){const pts=Array.from({length:9},(_,j)=>V(1.02+Math.sin(j*Math.PI/8)*.4,.65+j*.27,.27));chain(pts,.057,gold);tube(pts[0],pts[8],.014,.014,'#e8dab7',5)}
if(i===6||i===8){tube(V(1.02,1.76,.2),V(1.02,1.76,.34),.35,.35,gold,14);tube(V(1.02,1.76,.34),V(1.02,1.76,.39),.29,.29,i===6?'#dce4d7':'#f2ddaa',14)}
if(i===10){tube(V(1,1.53,.25),V(1,1.87,.25),.2,.32,'#a78258',8);for(let j=0;j<3;j++)ell(V(.86+j*.13,2.03,.25),V(.08,.25,.09),'#90ae77',6,4)}
group='ground';if(i===1||i===11)rabbit(1.1,.04,.95,1.05);if(i===2){for(let a of [-1,1])torus(V(a*.29,.18,.06),.31,.09,'#efb559','xz')}if(i===3)for(let j=0;j<5;j++){let a=j*2*Math.PI/5;ell(V(Math.cos(a)*1.1,.26,Math.sin(a)*1.1),V(.15,.23,.14),['#c96f57','#e4c46a','#73a9bc','#80ae87','#e7ddc7'][j],6,4)}
if(i===0){group='body';chain([V(.3,.94,-.3),V(.8,.92,-.7),V(1.11,1.35,-.82),V(.94,1.7,-.78)],.1,hair)}
return faces;
}
function rotateY(v,a){const c=Math.cos(a),s=Math.sin(a);return V(v[0]*c+v[2]*s,v[1],v[2]*c-v[0]*s)}
function transform(v,g,t,action,normal=false){if(g==='ground'||g==='sun-extra')return v;let bob=.025*Math.sin(t*2),a=action?Math.sin(Math.min(1,action)*Math.PI)*.36:0;let p=v;if(g==='right'||g==='left'){const pivot=V(g==='right'?.44:-.44,2.25,0),theta=(g==='right'?1:-1)*(a+.025*Math.sin(t*1.6)),c=Math.cos(theta),s=Math.sin(theta),q=normal?v:sub(v,pivot);p=V(q[0]*c-q[1]*s,q[0]*s+q[1]*c,q[2]);if(!normal)p=add(p,pivot)}if(g==='head'){const pivot=V(0,2.72,0),q=normal?v:sub(v,pivot);p=rotateY(q,.035*Math.sin(t*1.5));if(!normal)p=add(p,pivot)}return normal?p:add(p,V(0,bob+(action?.08*Math.sin(action*Math.PI):0),0))}
function projectScene(mesh,{yaw=.4,pitch=.32,zoom=1,w=800,h=600,t=0,action=0}={}){let camera=V(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)),right=V(Math.cos(yaw),0,-Math.sin(yaw)),up=cross(camera,right),scale=Math.min(w/6.35,h/5.55)*zoom,center=V(0,1.42,0),light=norm(V(-.5,1,.75));const projected=[];for(const f of mesh){let n=transform(f.n,f.g,t,action,true);if(dot(n,camera)<.002)continue;let p=f.p.map(x=>transform(x,f.g,t,action)),d=p.reduce((sum,x)=>sum+dot(x,camera),0)/p.length,pts=p.map(x=>{let q=sub(x,center);return [w/2+dot(q,right)*scale,h/2-dot(q,up)*scale]});projected.push({pts,d,c:color(f.c,clamp((.70+.31*Math.max(0,dot(n,light)))*f.t,.55,1.15))})}return projected.sort((a,b)=>a.d-b.d)}

function buildEffect(i,key){
 const prev=faces,prevGroup=group;faces=[];group='ground';
 const [land,robe,gold]=configs[i],petal='#e6b5ad',water='#82b8bf',moon='#f2e5b7';
 const bead=(x,y,z,r,c)=>ell(V(x,y,z),V(r,r,r),c,7,4);
 const arc=(x,y,z,r,c)=>chain(Array.from({length:12},(_,j)=>{let a=j*Math.PI/11;return V(x+Math.cos(a)*r,y+Math.sin(a)*r,z)}),.035,c);
 const flower=(x,z)=>lotus(x,z);
 const stars=()=>{for(let j=0;j<8;j++){let a=j*Math.PI/4;bead(Math.cos(a)*1.8,2.1+(j%3)*.36,Math.sin(a)*1.8,.065,gold)}};
 switch(key){
 case 'staff':tube(V(-1.1,.1,.5),V(-1.1,3.65,.5),.067,.067,'#b34e38');tube(V(-1.1,3.37,.5),V(-1.1,3.7,.5),.09,.09,gold);break;
 case 'cloud':for(let j=0;j<5;j++)ell(V(-.8+j*.36,.58+(j%2)*.08,.95),V(.42,.17,.3),'#eae7d9',8,4);break;
 case 'transform':for(let a of [-1,1]){ell(V(-1.15+a*.24,2.6,.85),V(.27,.34,.08),'#d7b86e',7,4);ell(V(-1.15+a*.17,2.26,.85),V(.19,.21,.07),petal,7,4)}tube(V(-1.15,2.13,.94),V(-1.15,2.84,.94),.035,.035,'#79563e');break;
 case 'rabbit':case 'jp-hare':rabbit(-1.15,.04,.98,.9);break;
 case 'moon':bead(-1.45,2.55,.55,.33,moon);if(i===4)bead(1.4,2.55,-.4,.32,'#f4c66b');break;
 case 'fire':for(let a of [-1,1]){torus(V(a*.4,.31,.1),.36,.07,'#d36b3e','xz');for(let j=0;j<6;j++){let t=j*Math.PI/3; tube(V(a*.4+Math.cos(t)*.35,.35,Math.sin(t)*.35+.1),V(a*.4+Math.cos(t)*.48,.62,Math.sin(t)*.48+.1),.075,0,'#efac55',5)}}break;
 case 'ribbon':chain(Array.from({length:17},(_,j)=>{let a=j*.24;return V(Math.cos(a)*1.32,.55+j*.145,Math.sin(a)*1.32)}),.065,'#c85847');break;
 case 'lotus':flower(1.18,1.08);flower(-1.12,1.08);flower(0,1.5);break;
 case 'stones':for(let j=0;j<5;j++){let a=j*2*Math.PI/5;bead(Math.cos(a)*1.3,2.1+.2*Math.sin(j),Math.sin(a)*1.3,.18,['#c96f57','#e4c46a','#73a9bc','#80ae87','#e7ddc7'][j])}break;
 case 'clay':for(let j=0;j<3;j++){let x=-.85+j*.65;bead(x,.65,1.18,.13,'#b78760');tube(V(x,.09,1.18),V(x,.49,1.18),.15,.10,'#ba936f',7)}break;
 case 'rainbow':for(let j=0;j<5;j++)arc(0,1.7,-.95,1.8-j*.12,['#c87561','#ddb36b','#d4cf79','#7dac8e','#83adcb'][j]);break;
 case 'sky':for(let j=0;j<2;j++)ell(V(0,2.5+j*.31,-.85),V(1.7,.06,.75),j?'#bdd2d0':'#91b9bf',10,4);break;
 case 'mountain':rock(-1.4,1,1.15,'#879b84');rock(1.35,.8,.85,'#a0aa8b');break;
 case 'suns':for(let j=0;j<10;j++){let a=j*2*Math.PI/10;torus(V(Math.cos(a)*2.05,1.85+.23*Math.sin(j),Math.sin(a)*2.05),.22,.023,'#f5d27c')}break;
 case 'balance':torus(V(2.05,1.85,0),.25,.04,'#f5d27c');break;
 case 'bow':tube(V(-1.05,1.8,.85),V(-.12,1.8,.85),.028,.028,'#dfba72',6);tube(V(-.12,1.8,.85),V(.14,1.8,.85),.095,0,'#dbd9bd',5);break;
 case 'jp-sun':case 'jp-mirror':for(let j=0;j<9;j++){let a=j*2*Math.PI/9;tube(V(Math.cos(a)*.4,2.7+Math.sin(a)*.4,.9),V(Math.cos(a)*1.12,2.7+Math.sin(a)*1.12,.9),.035,.009,gold,5)}break;
 case 'jp-cave':rock(-1.15,1.1,1.1,'#595954');rock(1.2,1.05,1.3,'#68635d');box(V(0,1.35,1.12),V(2.25,.35,.6),'#716a5f');break;
 case 'jp-storm':for(let j=0;j<5;j++){let x=-1.5+j*.72;chain([V(x,3.2,-.6),V(x-.18,2.82,-.4),V(x+.08,2.82,-.4),V(x-.1,2.43,-.3)],.035,'#f0d99a')}break;
 case 'jp-serpent':for(let j=0;j<8;j++){let a=Math.PI*j/7,x=Math.cos(a)*1.85,z=.9+Math.sin(a)*.68;chain([V(x,.05,z),V(x,.48,z-.09),V(x,.8+(j%2)*.15,z)],.095,'#708e66');ell(V(x,.86+(j%2)*.15,z+.07),V(.15,.11,.21),'#a0b576',7,4)}break;
 case 'jp-sword':tube(V(-1.1,.8,.7),V(-1.1,2.55,.7),.11,.015,'#dce5dd',4);box(V(-1.1,.8,.7),V(.45,.09,.15),gold);break;
 case 'jp-moon':bead(-1.4,2.5,.7,.4,moon);break;
 case 'jp-phases':for(let j=0;j<4;j++){let x=-1.35+j*.9;bead(x,3.65,.4,.18,j===0?'#505a70':j===2?moon:'#a2a7ad')}break;
 case 'jp-stars':stars();break;
 case 'jp-spear':tube(V(-1.1,.1,.7),V(-1.1,3.3,.7),.05,.05,'#9c744d');tube(V(-1.1,3.3,.7),V(-1.1,3.7,.7),.16,0,'#d1ded5',5);break;
 case 'jp-island':case 'jp-nature':for(let j=0;j<2;j++){let x=-1.3+j*2.6;ell(V(x,.18,1.15),V(.5,.16,.42),land,8,4);tree(x,1.15,.42,'#96b483')}break;
 case 'jp-water':for(let j=0;j<4;j++)torus(V(0,.11,.7),.45+j*.22,.016,water,'xz',16);break;
 case 'jp-bridge':bridge(0,1.15);break;
 case 'jp-heal':rabbit(-1.1,.04,.98,.8);for(let j=0;j<5;j++){let a=j*Math.PI*2/5;bead(-1.1+Math.cos(a)*.25,1.1,1+Math.sin(a)*.25,.06,'#e8b5a6')}break;
 case 'jp-reeds':for(let j=0;j<6;j++){let x=-1.3+j*.2;tube(V(x,.04,1.2),V(x+.06,.48+(j%3)*.1,1.2),.025,.015,'#8ca66a',5)}break;
 default:stars();
 }
 const result=faces;faces=prev;group=prevGroup;return result;
}

const api={build,buildEffect,projectScene,configs};
if(typeof window!=='undefined')window.Longora3DGeometry=api;
if(typeof document==='undefined')return;
const open=document.getElementById('open-3d'),overlay=document.getElementById('view3d'),canvas=document.getElementById('diorama-canvas');if(!open||!overlay||!canvas)return;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
let active=false,mesh=[],effectMesh=[],effectKey='',heroIndex=0,yaw=.38,pitch=.28,zoom=1,targetYaw=yaw,targetPitch=pitch,targetZoom=zoom,raf=0,last=0,started=0,actionStart=-1,drag=null,priorFocus=null,paused=false,needsDraw=true;
const $3=id=>document.getElementById(id),controls=()=>[...overlay.querySelectorAll('button:not(:disabled)')],quiet=()=>settings.calm||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function size(){const r=canvas.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,1.6);const w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;needsDraw=true}}
function draw(now){size();const q=quiet(),a=actionStart<0?0:clamp((now-actionStart)/900,0,1);if(a>=1)actionStart=-1;const {width:w,height:h}=canvas;ctx.clearRect(0,0,w,h);const grad=ctx.createRadialGradient(w*.5,h*.45,0,w*.5,h*.45,Math.max(w,h)*.6);grad.addColorStop(0,'#ffffff12');grad.addColorStop(1,'#101b2400');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);const base=effectKey==='balance'?mesh.filter(f=>f.g!=='sun-extra'):mesh;const p=projectScene(effectMesh.length?base.concat(effectMesh):base,{yaw,pitch,zoom,w,h,t:q?0:now/1000,action:q?0:a});for(const f of p){ctx.beginPath();f.pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=f.c;ctx.fill();ctx.strokeStyle=f.c;ctx.lineWidth=.55;ctx.stroke()}if(actionStart>=0){let a2=clamp((now-actionStart)/900,0,1);ctx.strokeStyle='rgba(247,220,151,'+(1-a2)*.7+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(w*.5,h*.61,w*.08+w*.2*a2,h*.025+h*.05*a2,0,0,Math.PI*2);ctx.stroke()}needsDraw=false}
function loop(now){raf=0;if(!active||paused||document.hidden)return;const q=quiet();if(!q&&now-last<33){raf=requestAnimationFrame(loop);return}last=now;const ease=q?1:.17,changed=Math.abs(targetYaw-yaw)+Math.abs(targetPitch-pitch)+Math.abs(targetZoom-zoom)>.0008;yaw+=(targetYaw-yaw)*ease;pitch+=(targetPitch-pitch)*ease;zoom+=(targetZoom-zoom)*ease;if(!q||changed||needsDraw||actionStart>=0)draw(now);if(!q)raf=requestAnimationFrame(loop)}
function wake(){needsDraw=true;if(active&&!raf&&!paused&&!document.hidden)raf=requestAnimationFrame(loop)}
function change(a,b,z){targetYaw+=a;targetPitch=clamp(targetPitch+b,.08,.70);targetZoom=clamp(targetZoom+z,.78,1.5);wake()}
function renderLabel(){const d=data[heroIndex];$3('view3d-title').textContent=d.name;$3('view3d-world').textContent=configs[heroIndex][4]+' · '+d.world;$3('view3d-powers').innerHTML=d.powers.map((p,j)=>'<button data-3d-power="'+j+'"><span aria-hidden="true">'+symbols[heroIndex][j]+'</span> '+p[0]+'</button>').join('');$3('view3d-feedback').textContent='Sürükle veya okları kullanarak dünyayı döndür.';overlay.style.setProperty('--scene-bg',palettes[heroIndex][0]);overlay.style.setProperty('--scene-glow',palettes[heroIndex][1]);canvas.setAttribute('aria-label',d.name+' üç boyutlu dioraması')}
function enter(){if(active)return;priorFocus=document.activeElement;heroIndex=index;mesh=build(heroIndex);effectMesh=[];effectKey='';yaw=targetYaw=.38;pitch=targetPitch=.28;zoom=targetZoom=1;actionStart=-1;active=true;paused=false;started=performance.now();overlay.hidden=false;overlay.inert=false;[...document.getElementById('app').children].filter(x=>x!==overlay).forEach(x=>x.inert=true);renderLabel();$3('close-3d').focus();wake()}
function close(){if(!active)return;active=false;effectMesh=[];effectKey='';cancelAnimationFrame(raf);raf=0;drag=null;overlay.hidden=true;overlay.inert=true;[...document.getElementById('app').children].filter(x=>x!==overlay).forEach(x=>x.inert=x.id==='sheet'&&!x.classList.contains('open'));if(priorFocus?.isConnected)priorFocus.focus()}
function action(j){if(!Number.isInteger(j)||j<0||j>2)return;power(j);effectKey=data[heroIndex].powers[j][2];effectMesh=buildEffect(heroIndex,effectKey);actionStart=quiet()?-1:performance.now();$3('view3d-feedback').textContent=data[heroIndex].powers[j][1];$3('view3d-powers').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===j)));wake()}
open.hidden=false;open.onclick=enter;$3('close-3d').onclick=close;$3('turn-left').onclick=()=>change(-.45,0,0);$3('turn-right').onclick=()=>change(.45,0,0);$3('tilt-up').onclick=()=>change(0,.12,0);$3('tilt-down').onclick=()=>change(0,-.12,0);$3('zoom-in-3d').onclick=()=>change(0,0,.16);$3('zoom-out-3d').onclick=()=>change(0,0,-.16);$3('reset-3d').onclick=()=>{targetYaw=.38;targetPitch=.28;targetZoom=1;wake()};$3('view3d-powers').onclick=e=>{const b=e.target.closest('[data-3d-power]');if(b)action(Number(b.dataset['3dPower']))};
canvas.addEventListener('pointerdown',e=>{if(!active||drag)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;change((e.clientX-drag.x)*.009,(e.clientY-drag.y)*.003,0);drag.x=e.clientX;drag.y=e.clientY});for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,e=>{if(drag?.id===e.pointerId)drag=null});
overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close()}else if(e.key==='Tab'){const a=controls();if(e.shiftKey&&document.activeElement===a[0]){e.preventDefault();a.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===a.at(-1)){e.preventDefault();a[0].focus()}}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();e.stopPropagation();change(e.key==='ArrowLeft'?-.22:e.key==='ArrowRight'?.22:0,e.key==='ArrowUp'?.08:e.key==='ArrowDown'?-.08:0,0)}});
window.addEventListener('resize',wake);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else wake()});
if(typeof ResizeObserver!=='undefined')new ResizeObserver(wake).observe(canvas);
})();