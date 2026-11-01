/* Design concept: CourtDesk motion system v3. Concept page only: the real page ships these libraries from its own files. */
(function(){
"use strict";
var doc=document.getElementById("doc"), root=document.documentElement, hasG=typeof window.gsap!=="undefined";
var RM=window.matchMedia("(prefers-reduced-motion: reduce)");
function q(s,c){return Array.prototype.slice.call((c||doc).querySelectorAll(s));}
function rtl(){return doc.dir==="rtl";}
function ar(){return doc.dataset.lang==="ar";}
function L(){return "[data-l='"+doc.dataset.lang+"']";}

q(".split").forEach(function(el){var ws=el.textContent.split(/(\s+)/);el.textContent="";ws.forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){el.appendChild(document.createTextNode(w));return;}var o=document.createElement("span");o.className="w";var i=document.createElement("span");i.textContent=w;o.appendChild(i);el.appendChild(o);});});
q(".statement .fill").forEach(function(p){
 function walk(node){Array.prototype.slice.call(node.childNodes).forEach(function(n){
  if(n.nodeType===3){var f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w));}else{var s=document.createElement("span");s.className="fw";s.textContent=w;f.appendChild(s);}});n.parentNode.replaceChild(f,n);}
  else if(n.nodeType===1){walk(n);}});}
 walk(p);});


var bar=document.getElementById("bar");
function headerTone(){var y=bar.getBoundingClientRect().bottom-10,dark=false;q(".band").forEach(function(b){var r=b.getBoundingClientRect();if(r.top<=y&&r.bottom>=y)dark=true;});bar.classList.toggle("dark",dark);bar.classList.toggle("light",!dark);}
window.addEventListener("scroll",function(){headerTone();if(Thread)Thread.update();},{passive:true});headerTone();

var who="team";
var CAP={team:["The case team sees the whole case.","يرى فريق القضية القضية كاملة."],clerk:["The court officer sees only the task, the brief and its documents.","يرى موظف المحكمة المهمة والموجز ومستنداتها فقط."],partner:["The managing partner sees only the register entry: number, responsible consultant, status.","يرى الشريك الإداري قيد السجل فقط: الرقم والمستشار المسؤول والحالة."]};
function renderWho(anim){q(".who button").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.who===who);});document.getElementById("viewCap").textContent=CAP[who][ar()?1:0];
 q("#case .rw").forEach(function(r,i){var show=r.dataset.vis.split(" ").indexOf(who)>-1,red=r.querySelector(".red"),tx=r.querySelector(".tx");
  if(hasG&&anim&&!RM.matches){gsap.to(red,{scaleX:show?0:1,duration:.55,ease:"power3.inOut",delay:i*.05});gsap.to(tx,{autoAlpha:show?1:0,duration:.25,delay:show?.32:0});}
  else{red.style.transform="scaleX("+(show?0:1)+")";tx.style.visibility=show?"visible":"hidden";tx.style.opacity=show?1:0;}});}
q(".who button").forEach(function(b){b.addEventListener("click",function(){who=b.dataset.who;renderWho(true);});});
renderWho(false);

if(!hasG){q(".statement .fw").forEach(function(w){w.style.opacity=1;});return;}
gsap.registerPlugin(ScrollTrigger);
var E="expo.out", mm=null, lenis=null;

var S={a:0}, beam=document.getElementById("beam"), panL=document.getElementById("panL"), panR=document.getElementById("panR");
function drawScales(){var r=S.a*Math.PI/180,c=Math.cos(r)*190,s=Math.sin(r)*190;
 beam.setAttribute("transform","rotate("+S.a+" 320 150)");
 panL.setAttribute("transform","translate("+(320-c)+" "+(150-s)+")");
 panR.setAttribute("transform","translate("+(320+c)+" "+(150+s)+")");}
drawScales();

function setApproved(on){var t=document.getElementById("apSub"),c=document.getElementById("apChip");
 if(on){t.innerHTML='<span data-l="en">Approved by you · L. Haddad, Partner</span><span data-l="ar">اعتمدتِه · ل. حداد، شريكة</span>';c.className="chip ok";c.innerHTML='<span data-l="en">Approved · sample</span><span data-l="ar">معتمد · تجريبي</span>';}
 else{t.innerHTML='<span data-l="en">Awaiting your decision</span><span data-l="ar">بانتظار قرارك</span>';c.className="chip wait";c.innerHTML='<span data-l="en">Sample</span><span data-l="ar">تجريبي</span>';}}
function finalState(){
 S.a=0;drawScales();gsap.set("#loadL .chip,#weight",{autoAlpha:1,y:0});
 q("#legend div").forEach(function(d){d.classList.add("on");});
 q(".sig").forEach(function(p){gsap.set(p,{strokeDasharray:"none",strokeDashoffset:0});});
 q(".statement .fw").forEach(function(w){w.style.opacity=1;});
 q(".stn").forEach(function(s){s.classList.add("on");});q("#trNotes>div").forEach(function(n){n.classList.add("on");});
 gsap.set("#apRing",{"--fill":1});setApproved(true);gsap.set("#sProg",{scaleX:1});
 gsap.set("#folios .folio",{"--p":1});gsap.set("#folios .stamp",{"--k":1});
}

/* The logo draws itself: the path is written, the margin rule set, then the amber ring closes it (the decision). */
function markTL(svg,k){k=k||1;var tl=gsap.timeline({paused:true});if(!svg)return tl;
 var pth=svg.querySelector(".m-path"),rule=svg.querySelector(".m-rule");[pth,rule].forEach(function(x){var L=x.getTotalLength();gsap.set(x,{strokeDasharray:L,strokeDashoffset:L});});
 gsap.set(svg.querySelectorAll(".m-ring,.m-dot"),{scale:0});
 tl.to(pth,{strokeDashoffset:0,duration:.9*k,ease:"power2.inOut"})
   .to(rule,{strokeDashoffset:0,duration:.35*k,ease:"expo.out"},"-=.15")
   .to(svg.querySelector(".m-ring"),{scale:1,duration:.55*k,ease:"back.out(2.6)"},"-=.05")
   .to(svg.querySelector(".m-dot"),{scale:1,duration:.35*k,ease:"expo.out"},"-=.3");
 return tl;}
var headMark=null;
document.querySelector(".lock").addEventListener("mouseenter",function(){if(headMark&&!RM.matches)headMark.play(0);});
function build(){
 mm=gsap.matchMedia();
 mm.add({motion:"(prefers-reduced-motion: no-preference)",reduce:"(prefers-reduced-motion: reduce)",desk:"(min-width: 861px)"},function(ctx){
  var c=ctx.conditions, dir=rtl()?-1:1;
  setApproved(false);
  if(c.reduce){finalState();return;}
  headMark=markTL(doc.querySelector(".mk-head"));headMark.play(0);

  /* hero intro: headline words set, scales draw themselves */
  var words=q("#h0 "+L()+" .w>span");
  q("#scales .draw").forEach(function(p){var len=p.getTotalLength?p.getTotalLength():400;gsap.set(p,{strokeDasharray:len,strokeDashoffset:len});});
  var sigs=q("#h0 "+L()+" .sig");sigs.forEach(function(p){var len=p.getTotalLength();gsap.set(p,{strokeDasharray:len,strokeDashoffset:len,autoAlpha:0});});
  gsap.set("#loadL .chip,#weight",{autoAlpha:0,y:-160});
  S.a=0;drawScales();
  var intro=gsap.timeline({defaults:{ease:E}});
  intro.fromTo(words,{yPercent:-115},{yPercent:0,duration:1,stagger:.07})
   .fromTo("#hero .lede,#hero .hero-cta,#legend",{autoAlpha:0,y:-18},{autoAlpha:1,y:0,duration:.8,stagger:.1},"-=.6")
   .to("#scales .draw",{strokeDashoffset:0,duration:1.6,ease:"power2.inOut",stagger:.06},"<-.2")
   .to(S,{a:4,duration:1.2,ease:"sine.inOut",onUpdate:drawScales},"-=.6")
   .to(S,{a:-2,duration:1.4,ease:"sine.inOut",onUpdate:drawScales})
   .to(S,{a:0,duration:1,ease:"sine.inOut",onUpdate:drawScales});

  /* behind the scales: measurement rings turn slowly in opposite directions; the light breathes */
  gsap.fromTo("#halo",{autoAlpha:0,scale:.85,svgOrigin:"320 320"},{autoAlpha:1,scale:1,svgOrigin:"320 320",duration:1.8,ease:E,delay:.3});
  gsap.to("#ringA",{rotation:360,svgOrigin:"320 320",duration:120,ease:"none",repeat:-1});
  gsap.to("#ringB",{rotation:-360,svgOrigin:"320 320",duration:90,ease:"none",repeat:-1});
  gsap.fromTo("#spotC",{opacity:.75},{opacity:1,duration:4,ease:"sine.inOut",yoyo:true,repeat:-1});

  /* hero weighing: pinned and scrubbed on desktop; plays by itself on phones */
  var chips=q("#loadL .chip").reverse(), legend=q("#legend div");
  function legendTo(p){var k=Math.floor(p*5.2);legend.forEach(function(d,i){d.classList.toggle("on",i<k);});}
  var weigh=gsap.timeline({defaults:{ease:"power2.out"},paused:!c.desk,
   scrollTrigger:c.desk?{trigger:"#hero",start:"top top",end:"+=2800",pin:"#hero .hero-pin",scrub:1.6,onUpdate:function(s){legendTo(s.progress);}}:undefined});
  chips.reverse().forEach(function(ch,i){
   /* each piece of work drops in, bounces, and the beam answers with a damped, springy swing */
   weigh.to(ch,{autoAlpha:1,duration:.12},i*.7)
        .fromTo(ch,{y:-170},{y:0,duration:.6,ease:"bounce.out"},i*.7)
        .to(S,{a:-(i+1)*3.4,duration:1,ease:"elastic.out(1.25,.28)",onUpdate:drawScales},i*.7+.34);
  });
  /* the judgment lands last: a heavier bounce, then the beam swings through level and settles in balance */
  weigh.to("#weight",{autoAlpha:1,duration:.12},2.95)
       .fromTo("#weight",{y:-190},{y:0,duration:.75,ease:"bounce.out"},2.95)
       .to(S,{a:0,duration:1.6,ease:"elastic.out(1.4,.22)",onUpdate:drawScales},3.32)
       .fromTo("#weight .o",{scale:1,transformOrigin:"50% 50%"},{scale:1.25,duration:.18,yoyo:true,repeat:1,ease:"power2.out"},3.4)
       .set(sigs,{autoAlpha:1},3.88)
       .to(sigs,{strokeDashoffset:0,duration:.6,ease:"power2.inOut"},3.9);
  if(!c.desk){weigh.eventCallback("onUpdate",function(){legendTo(weigh.progress());});
   ScrollTrigger.create({trigger:"#scales",start:"top 70%",once:true,onEnter:function(){gsap.delayedCall(1.2,function(){weigh.play();});}});}

  /* statement: words fill as you read */
  gsap.to(".statement "+L()+" .fw",{opacity:1,ease:"none",stagger:.1,scrollTrigger:{trigger:".statement",start:"top 75%",end:"bottom 55%",scrub:.6}});

  /* statement folios: each drops in from above, its line fills, then it is stamped ("Yours" in amber) */
  var fol=q("#folios .folio"), ftl=gsap.timeline({scrollTrigger:{trigger:".statement",start:"top 70%",end:"bottom 45%",scrub:.7}});
  fol.forEach(function(f,i){
   ftl.fromTo(f,{autoAlpha:0,y:-60,rotation:dir*(i%2?1.5:-1.5)},{autoAlpha:1,y:0,rotation:0,duration:.6,ease:"power2.out"},i*.8)
      .fromTo(f,{"--p":0},{"--p":1,duration:.5,ease:"none"},i*.8+.3)
      .fromTo(f.querySelector(".stamp"),{"--k":0},{"--k":1,duration:.25,ease:"back.out(3)"},i*.8+.75);
  });

  /* section headings rise from a mask */
  q("section:not(.hero) h2").forEach(function(h){gsap.fromTo(h,{clipPath:"inset(0 0 100% 0)",y:-40},{clipPath:"inset(0 0 -20% 0)",y:0,duration:1.1,ease:E,scrollTrigger:{trigger:h,start:"top 85%",once:true}});});

  /* agents: horizontal scroll while scrolling down (desktop) */
  if(c.desk){var track=document.getElementById("agTrack");
   var dist=function(){return Math.max(0,track.scrollWidth-window.innerWidth);};
   gsap.to(track,{x:function(){return -dir*dist();},ease:"none",scrollTrigger:{trigger:"#agents",start:"top top",end:function(){return "+="+dist();},pin:"#agents .ag-pin",scrub:.8,invalidateOnRefresh:true,
    onUpdate:function(s){gsap.set("#agBar",{scaleX:s.progress});}}});
   gsap.fromTo("#agTrack .ag",{y:-60,autoAlpha:0},{y:0,autoAlpha:1,stagger:.08,duration:.9,ease:E,scrollTrigger:{trigger:"#agents",start:"top 70%",once:true}});
  }

  /* journey: pinned, the task travels */
  var sts=q(".stn"), notes=q("#trNotes>div");
  gsap.timeline({scrollTrigger:{trigger:"#journey",start:"top top",end:"+=1500",pin:"#journey .tr-pin",scrub:.8,
   onUpdate:function(s){var k=Math.min(4,Math.floor(s.progress*5.02));sts.forEach(function(x,i){x.classList.toggle("on",i<=k);});notes.forEach(function(n,i){n.classList.toggle("on",i===k);});}}})
   .fromTo("#token",{xPercent:0},{xPercent:dir*400,ease:"none",duration:1})
   .fromTo("#trFill",{scaleX:0},{scaleX:1,ease:"none",duration:1},0);

  /* workspace: layers at different depths, the day assembles top-down, pointer tilt */
  if(c.desk){q("#glimpse .layer").forEach(function(l){var d=parseFloat(l.dataset.depth);gsap.fromTo(l,{y:200*d},{y:-110*d,ease:"none",scrollTrigger:{trigger:"#glimpse",start:"top bottom",end:"bottom top",scrub:.6}});});
   var app=document.getElementById("lApp"),st=document.getElementById("glimpse");gsap.set(app,{transformPerspective:1800});
   var rx=gsap.quickTo(app,"rotationX",{duration:.8,ease:"power3"}),ry=gsap.quickTo(app,"rotationY",{duration:.8,ease:"power3"});
   st.addEventListener("pointermove",function(e){var r=st.getBoundingClientRect();ry(((e.clientX-r.left)/r.width-.5)*5);rx(-((e.clientY-r.top)/r.height-.5)*4);});
   st.addEventListener("pointerleave",function(){rx(0);ry(0);});}
  var ws=gsap.timeline({paused:true,defaults:{ease:E}});
  ws.fromTo("#glimpse .ap-hello",{autoAlpha:0,y:-14},{autoAlpha:1,y:0,duration:.6})
    .fromTo("#glimpse .tl .ev",{scaleX:0},{scaleX:1,duration:.6,stagger:.12},"-=.3")
    .fromTo("#glimpse .tl .now",{autoAlpha:0,scaleY:0,transformOrigin:"50% 0"},{autoAlpha:1,scaleY:1,duration:.5},"-=.2")
    .fromTo("#glimpse .dr",{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:.55,stagger:.1},"-=.3")
    .fromTo("#glimpse .by span",{scale:0},{scale:1,duration:.35,stagger:.04,ease:"back.out(2.4)"},"-=.3")
    .fromTo("#glimpse .pipe i",{scaleX:0},{scaleX:1,duration:.8,stagger:.08},"-=.2")
    .fromTo("#glimpse .mn",{autoAlpha:0,x:dir*16},{autoAlpha:1,x:0,duration:.5,stagger:.12},"-=.7")
    .fromTo("#lToast",{autoAlpha:0,y:-30},{autoAlpha:1,y:0,duration:.6,ease:"back.out(1.6)"},"-=.2")
    .fromTo("#lDec",{autoAlpha:0,y:-24},{autoAlpha:1,y:0,duration:.6},"-=.1")
    .fromTo("#lDec .ring",{boxShadow:"0 0 0 0 rgb(255 178 62 / .6)"},{boxShadow:"0 0 0 12px rgb(255 178 62 / 0)",duration:1.1,ease:"power2.out"});
  ScrollTrigger.create({trigger:"#glimpse",start:"top 75%",once:true,onEnter:function(){ws.play(0);}});
  if(!c.desk){gsap.fromTo("#glimpse .layer",{y:-30,autoAlpha:0},{y:0,autoAlpha:1,stagger:.12,duration:.7,ease:E,scrollTrigger:{trigger:"#glimpse",start:"top 85%",once:true}});}

  /* status: a pinned presentation; each column arrives top-down in turn as you scroll */
  var cols=q("#status .status3>div");
  if(c.desk){
   var stl=gsap.timeline({scrollTrigger:{trigger:"#status",start:"top top",end:"+=1300",pin:"#status .st-pin",scrub:.7}});
   stl.fromTo("#sProg",{scaleX:0},{scaleX:1,ease:"none",duration:3},0);
   cols.forEach(function(col,i){
    stl.fromTo(col,{autoAlpha:.12,y:-40},{autoAlpha:1,y:0,duration:.6,ease:"power2.out"},i)
       .fromTo(col.querySelector("h3 i"),{scale:0},{scale:1,duration:.3,ease:"back.out(3)"},i+.2)
       .fromTo(col.querySelectorAll("li"),{autoAlpha:0,y:-12},{autoAlpha:1,y:0,stagger:.08,duration:.35},i+.25);
   });
  }else{
   cols.forEach(function(col){gsap.fromTo(col,{autoAlpha:0,y:-30},{autoAlpha:1,y:0,duration:.7,ease:E,scrollTrigger:{trigger:col,start:"top 85%",once:true}});});
   gsap.set("#sProg",{scaleX:1});
  }

  /* roll: rows flip in like a court board */
  gsap.fromTo("#roll .rr",{rotationX:-85,autoAlpha:0},{rotationX:0,autoAlpha:1,duration:.75,stagger:.13,ease:"back.out(1.5)",scrollTrigger:{trigger:"#roll",start:"top 80%",once:true}});

  /* decision: one gavel strike, one amber ripple, the approval lands */
  /* the gavel: poised and gently swaying while it waits for your decision; it strikes when it reaches the middle of the screen,
     strikes again if you scroll back and return, and on click. Impact: block gives, two amber ripples, the card settles. */
  var O={svgOrigin:"262 178"};
  gsap.set("#gavelG",Object.assign({rotation:20},O));gsap.set("#apRing",{"--fill":0});
  var idle=gsap.to("#gavelG",Object.assign({rotation:27,duration:1.6,ease:"sine.inOut",yoyo:true,repeat:-1},O));
  function strikeTL(){
   idle.pause();setApproved(false);gsap.set("#apRing",{"--fill":0});
   return gsap.timeline()
    .to("#gavelG",Object.assign({rotation:40,duration:.6,ease:"power2.out"},O))
    .to("#gavelG",Object.assign({rotation:0,duration:.2,ease:"power4.in"},O))
    .addLabel("hit")
    .fromTo("#gBlock",{scaleY:1,transformOrigin:"50% 100%"},{scaleY:.9,duration:.08,yoyo:true,repeat:1,ease:"power2.out"},"hit")
    .fromTo("#ripple",{scale:.2,autoAlpha:1},{scale:2.4,autoAlpha:0,duration:.9,ease:"expo.out"},"hit")
    .fromTo("#ripple2",{scale:.2,autoAlpha:.8},{scale:3.4,autoAlpha:0,duration:1.3,ease:"expo.out"},"hit+=.12")
    .to("#gavelG",Object.assign({rotation:14,duration:.28,ease:"power2.out"},O),"hit")
    .to("#gavelG",Object.assign({rotation:0,duration:.22,ease:"power3.in"},O),"hit+=.28")
    .fromTo("#gBlock",{scaleY:1},{scaleY:.95,duration:.06,yoyo:true,repeat:1},"hit+=.5")
    .to("#gavelG",Object.assign({rotation:8,duration:.8,ease:"elastic.out(1,.5)"},O),"hit+=.56")
    .to("#apRing",{"--fill":1,duration:.4,ease:E},"hit+=.1")
    .call(function(){setApproved(true);},null,"hit+=.15")
    .fromTo(".approval",{y:0},{y:-6,duration:.12,yoyo:true,repeat:1,ease:"power2.out"},"hit")
    .call(function(){gsap.to("#gavelG",Object.assign({rotation:13,duration:1.4,ease:"sine.inOut",yoyo:true,repeat:-1},O));},null,"hit+=1.4");
  }
  var cur=null;function strike(){if(cur)cur.kill();gsap.killTweensOf("#gavelG");cur=strikeTL();}
  ScrollTrigger.create({trigger:"#gavelStage",start:"center 62%",onEnter:strike,onLeaveBack:function(){if(cur)cur.kill();gsap.killTweensOf("#gavelG");setApproved(false);gsap.set("#apRing",{"--fill":0});gsap.set("#gavelG",Object.assign({rotation:20},O));idle=gsap.to("#gavelG",Object.assign({rotation:27,duration:1.6,ease:"sine.inOut",yoyo:true,repeat:-1},O));}});
  var gs=document.getElementById("gavelStage");gs.onclick=strike;gs.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();strike();}};

  /* closing: mark arrives */
  var bigMark=markTL(doc.querySelector(".closing .mk-big"),1.4);ScrollTrigger.create({trigger:".closing",start:"top 70%",once:true,onEnter:function(){bigMark.play(0);}});
  return function(){};
 });
}
function rebuild(){if(mm)mm.revert();ScrollTrigger.getAll().forEach(function(t){t.kill();});build();ScrollTrigger.refresh();headerTone();}

/* The thread: built from the real section positions (after pins are measured), drawn as you scroll; desktop only. */
var Thread=(function(){
 var svg=document.getElementById("thread"),path=document.getElementById("threadPath"),ghost=document.getElementById("threadGhost"),knotsG=document.getElementById("knots"),head=document.getElementById("threadHead"),glow=document.getElementById("threadGlow");
 var len=0,samples=[],knots=[],on=false,mainTop=0;
 function build(){
  var main=document.getElementById("main");
  if(window.innerWidth<1180||RM.matches){svg.style.display="none";on=false;return;}
  var W=main.clientWidth,H=main.scrollHeight;svg.style.display="block";svg.setAttribute("width",W);svg.setAttribute("height",H);svg.setAttribute("viewBox","0 0 "+W+" "+H);
  var mr=main.getBoundingClientRect();mainTop=mr.top+window.scrollY;
  var secs=Array.prototype.slice.call(main.querySelectorAll(":scope > section"));
  var ys=secs.map(function(sec){return sec.getBoundingClientRect().top-mr.top;}).filter(function(y,i,a){return y>200&&(i===0||Math.abs(y-a[i-1])>60);});
  var g=Math.max(26,(W-1220)/2*.42), xs=[g,W-g]; if(rtl())xs.reverse();
  var mk=document.querySelector(".closing .mk-big"),mb=mk.getBoundingClientRect(),endX=mb.left-mr.left+mb.width/2,endY=mb.top-mr.top+mb.height/2;
  var side=0,y0=Math.max(120,ys[0]-260),d="M"+xs[0]+" "+y0;knots=[];
  ys.forEach(function(y,i){if(y>=endY-140)return;var a=xs[side],b=xs[1-side];
   d+=" L"+a+" "+(y-70)+" C"+a+" "+(y-10)+" "+b+" "+(y-10)+" "+b+" "+(y+60);knots.push({x:(a+b)/2,y:y-10});side=1-side;});
  var cx=xs[side];d+=" L"+cx+" "+(endY-120)+" C"+cx+" "+(endY-20)+" "+endX+" "+(endY-90)+" "+endX+" "+(endY-34);
  path.setAttribute("d",d);ghost.setAttribute("d",d);len=path.getTotalLength();path.style.strokeDasharray=len;
  samples=[];for(var L=0;L<=len;L+=10){var pt=path.getPointAtLength(L);samples.push([L,pt.x,pt.y]);}
  knotsG.innerHTML="";knots.forEach(function(k){var c=document.createElementNS("http://www.w3.org/2000/svg","circle");c.setAttribute("class","knot");c.setAttribute("cx",k.x);c.setAttribute("cy",k.y);c.setAttribute("r",4.5);knotsG.appendChild(c);k.el=c;});
  on=true;update();}
 function update(){if(!on)return;var target=window.scrollY+window.innerHeight*.62-mainTop;
  var lo=0,hi=samples.length-1;while(lo<hi){var m=(lo+hi)>>1;if(samples[m][2]<target)lo=m+1;else hi=m;}
  var sm=samples[Math.max(0,lo)]||[0,0,0];var drawn=target<samples[0][2]?0:sm[0];
  path.style.strokeDashoffset=len-drawn;var vis=drawn>0&&drawn<len-2;
  head.setAttribute("cx",sm[1]);head.setAttribute("cy",sm[2]);glow.setAttribute("cx",sm[1]);glow.setAttribute("cy",sm[2]);
  head.style.opacity=vis?1:0;glow.style.opacity=vis?.22:0;
  knots.forEach(function(k){k.el.classList.toggle("lit",k.y<target);});}
 return {build:build,update:update};
})();

/* Closing background: agents orbit the matter and, one by one, hand their work inward to the amber centre (your judgment).
   Canvas, paused off screen, one still frame under reduced motion, drawn from the brand tokens so it follows the colour switch. */
(function(){
 var sec=document.getElementById("closing"), cv=document.getElementById("orbit"); if(!cv||!cv.getContext)return;
 var ctx=cv.getContext("2d"), W=0,H=0,cx=0,cy=0,dpr=1, visible=false, raf=0, col={}, t0=performance.now(), frame=0;
 var rings=[.34,.52,.70,.88,1.06], agents=[], hand=null, pulses=[], tiltX=0,tiltY=0,tx=0,ty=0;
 for(var i=0;i<9;i++)agents.push({ring:i%5,a:Math.random()*Math.PI*2,sp:(.05+Math.random()*.07)*(i%2?1:-1)});
 function colors(){var cs=getComputedStyle(doc);col={brass:cs.getPropertyValue("--brass").trim()||"#C9A45C",agent:cs.getPropertyValue("--mint").trim()||"#8EC5FF",amber:"#FFB23E",ivory:"#F7F4EC"};}
 function size(){var r=sec.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  var mk=sec.querySelector(".mk-big").getBoundingClientRect();cx=mk.left-r.left+mk.width/2;cy=mk.top-r.top+mk.height/2;}
 function R(){return Math.min(W*.62,720);}
 function pos(ag,time){var rr=R()*rings[ag.ring],a=ag.a+time*ag.sp;return [cx+Math.cos(a)*rr+tiltX*rings[ag.ring]*18,cy+Math.sin(a)*rr*.34+tiltY*rings[ag.ring]*10];}
 function draw(now){
  var time=(now-t0)/1000; if(frame++%60===0)colors();
  tiltX+=(tx-tiltX)*.05;tiltY+=(ty-tiltY)*.05;
  ctx.clearRect(0,0,W,H);
  rings.forEach(function(k,i){var rr=R()*k;ctx.beginPath();ctx.ellipse(cx+tiltX*k*18,cy+tiltY*k*10,rr,rr*.34,0,0,Math.PI*2);ctx.strokeStyle=col.brass;ctx.globalAlpha=.16+.07*(i%2);ctx.lineWidth=1;ctx.stroke();});
  ctx.globalAlpha=1;
  agents.forEach(function(ag){var p=pos(ag,time);ctx.beginPath();ctx.arc(p[0],p[1],3.2,0,Math.PI*2);ctx.fillStyle=col.agent;ctx.globalAlpha=.9;ctx.fill();});
  if(!hand&&!RM.matches&&time%3<.02){var ag=agents[Math.floor(Math.random()*agents.length)];hand={ag:ag,s:time};}
  if(hand){var k=Math.min(1,(time-hand.s)/1.3),e=1-Math.pow(1-k,3),p0=pos(hand.ag,hand.s);var x=p0[0]+(cx-p0[0])*e,y=p0[1]+(cy-p0[1])*e;
   ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(x,y);ctx.strokeStyle=col.agent;ctx.globalAlpha=.35*(1-k*.6);ctx.lineWidth=1;ctx.stroke();
   ctx.beginPath();ctx.arc(x,y,3.4,0,Math.PI*2);ctx.fillStyle=col.agent;ctx.globalAlpha=.95;ctx.fill();
   if(k>=1){pulses.push({s:time});hand=null;}}
  pulses=pulses.filter(function(pl){var k=(time-pl.s)/1.6;if(k>1)return false;ctx.beginPath();ctx.arc(cx,cy,60+k*140,0,Math.PI*2);ctx.strokeStyle=col.amber;ctx.globalAlpha=.45*(1-k);ctx.lineWidth=1.5;ctx.stroke();return true;});
  ctx.globalAlpha=1;
  if(visible&&!RM.matches)raf=requestAnimationFrame(draw);
 }
 function start(){cancelAnimationFrame(raf);colors();size();if(RM.matches){draw(t0+4000);return;}raf=requestAnimationFrame(draw);}
 if("IntersectionObserver" in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible)start();else cancelAnimationFrame(raf);}).observe(sec);}else{visible=true;start();}
 window.addEventListener("resize",function(){if(visible)start();});
 sec.addEventListener("pointermove",function(e){var r=sec.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*2;ty=((e.clientY-r.top)/r.height-.5)*2;});
 sec.addEventListener("pointerleave",function(){tx=0;ty=0;});
 RM.addEventListener("change",start);
})();

if(typeof window.Lenis!=="undefined"){
 lenis=new Lenis({lerp:.06,wheelMultiplier:.85,smoothWheel:true});
 lenis.on("scroll",function(){ScrollTrigger.update();headerTone();Thread.update();});
 gsap.ticker.add(function(t){lenis.raf(t*1000);});gsap.ticker.lagSmoothing(0);
 q('a[href^="#"]').forEach(function(a){a.addEventListener("click",function(e){var id=a.getAttribute("href");if(id.length>1&&document.querySelector(id)){e.preventDefault();lenis.scrollTo(id,{offset:-60});}});});
}
build();
ScrollTrigger.addEventListener("refresh",function(){Thread.build();});
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){ScrollTrigger.refresh();});}
setTimeout(function(){Thread.build();},300);
})();
