/* CHỈNH NỘI DUNG TRUYỆN Ở MẢNG STORY BÊN DƯỚI.
   Các loại: narration, dialogue, image, sound, choices, divider.
   Đây là truyện minh họa, không phải nội dung chính thức của game. */
const STORY = [

  {type:'choices',options:[
    {label:'Không',
      result:[
        {type:'dialogue',speaker:'MC',character:'mc',text:'Không. Nếu tôi thua, bao nhiêu năm nỗ lực và chuẩn bị đều sẽ đổ sông đổ biển.'}]},
    {label:'Có',
      result:[
        {type:'dialogue',speaker:'MC',character:'mc',text:'Tất nhiên rồi. Dù niềm hạnh phúc ấy không có thật, tôi vẫn muốn nó kéo dài thêm một chút.'}]},
    {label:'Tôi không biết',
      result:[
        {type:'dialogue',speaker:'MC',character:'mc',text:'Tôi không biết. Tôi đã không còn là con người của năm đó nữa, và cũng sẽ chẳng bao giờ rơi vào tình huống tương tự.'}]}
  ]},
  
  
];
const root=document.getElementById('story');
function el(tag,cls,content){const node=document.createElement(tag);if(cls)node.className=cls;if(content!==undefined)node.textContent=content;return node}
function notifyHeight(){requestAnimationFrame(()=>window.parent.postMessage({type:'STORY_HEIGHT',height:Math.ceil(document.documentElement.scrollHeight)},'*'))}
function 
renderBlock(block){const wrap=el('section','block');switch(block.type){
case 'narration':wrap.append(el('div','narration'+(block.highlight?' highlight':''),block.text));break;
case 'dialogue': {
    const character = String(block.character || '').toLowerCase();
    const kind = ['sylus', 'mc'].includes(character)
        ? character
        : 'other';

    const c = el('div', 'character ' + kind);

    const speaker = el('div', 'speaker', block.speaker);

    const row = el('div', 'dialogue-row');

    const avatar = el('img', 'avatar');
    avatar.src = kind === 'sylus'
        ? 'assets/sylus-avatar.png'
        : 'assets/mc-avatar.png';

    avatar.alt = block.speaker;
    avatar.addEventListener('load', notifyHeight);

    const dialogue = el('div', 'dialogue', block.text);

    if (kind === 'mc') {
        row.append(dialogue, avatar);
    } else {
        row.append(avatar, dialogue);
    }

    c.append(speaker, row);
    wrap.append(c);
    break;
}
case 'image':{const img=el('img','story-image');img.src=block.src;img.alt=block.alt||'Hình minh họa';img.loading='lazy';img.addEventListener('load',notifyHeight);wrap.append(img);break}
case 'sound':wrap.append(el('div','sound'+(block.effect?' effect':''),block.text));break;
case 'divider':wrap.append(el('div','divider'));break;
case 'choices':{const choices=el('div','choices'),result=el('div','choice-result');(block.options||[]).forEach(option=>{const btn=el('button','choice',option.label);btn.type='button';btn.addEventListener('click',()=>{choices.querySelectorAll('button').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false')});btn.classList.add('selected');btn.setAttribute('aria-pressed','true');result.replaceChildren(...(option.result||[]).map(renderBlock));notifyHeight()});btn.setAttribute('aria-pressed','false');choices.append(btn)});wrap.append(choices,result);break}
}return wrap}
root.append(...STORY.map(renderBlock));

