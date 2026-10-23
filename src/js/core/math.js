/* Version-pinned local MathJax. Question text is always inserted as textContent. */
window.MathJax={
  startup:{typeset:false},
  tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]']],packages:['base','ams','newcommand','noundefined'],maxBuffer:50000},
  svg:{fontCache:'local'},
  options:{enableMenu:false,skipHtmlTags:['script','noscript','style','textarea','pre','code']}
};
const EACMath=(()=>{
  let chain=Promise.resolve();
  function clear(root){if(window.MathJax.typesetClear)window.MathJax.typesetClear([root]);}
  function render(root){
    chain=chain.catch(()=>{}).then(async()=>{
      if(!root?.isConnected)return;
      await window.MathJax.startup.promise;
      await window.MathJax.typesetPromise([root]);
    }).catch(error=>{root.dataset.mathError=error.message;});
    return chain;
  }
  function syncLanguages(){
    document.querySelectorAll('[data-language-select]').forEach(group=>{
      const select=document.getElementById(group.dataset.languageSelect);
      group.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===select.value)));
    });
  }
  function bindLanguages(){
    document.querySelectorAll('[data-language-select]').forEach(group=>{
      const select=document.getElementById(group.dataset.languageSelect);
      group.querySelectorAll('[data-language]').forEach(button=>button.onclick=()=>{
        if(select.value===button.dataset.language)return;
        select.value=button.dataset.language;select.dispatchEvent(new Event('change',{bubbles:true}));syncLanguages();
      });
    });
    syncLanguages();
  }
  function content(root,q,language='bilingual'){
    if(!q.contentBlocks)return false;
    const languages=language==='zh'?['zh-Hant']:language==='en'?['en']:['en','zh-Hant'];
    const seen=new Set();root.replaceChildren();root.classList.add('question-blocks');
    for(const code of languages){
      const group=document.createElement('div');group.lang=code;group.className='question-block-language';
      for(const block of q.contentBlocks[code]||[]){
        if(block.type==='paragraph'){const p=document.createElement('p');p.textContent=block.text;group.append(p);}
        if(block.type==='table'){
          const wrap=document.createElement('div');wrap.className='question-table-scroll';wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label',code==='en'?'Question data table':'題目數據表');
          const table=document.createElement('table');
          if(block.caption){const caption=document.createElement('caption');caption.textContent=block.caption;table.append(caption);}
          for(const [index,row]of block.rows.entries()){const tr=document.createElement('tr');for(const value of row){const td=document.createElement(index===0?'th':'td');if(index===0)td.scope='col';td.textContent=value;tr.append(td);}table.append(tr);}
          wrap.append(table);group.append(wrap);
        }
        if(block.type==='figure'&&!seen.has(block.diagram.src)){
          seen.add(block.diagram.src);const d=block.diagram,figure=document.createElement('figure'),a=document.createElement('a'),img=document.createElement('img'),caption=document.createElement('figcaption');
          figure.className='question-figure';a.href=d.src;a.target='_blank';a.rel='noopener';a.setAttribute('aria-label','放大題圖 / Enlarge figure');img.src=d.src;img.alt=d.alt;caption.textContent=d.caption;a.append(img);figure.append(a,caption);group.append(figure);
        }
      }
      root.append(group);
    }
    return true;
  }
  return {clear,render,bindLanguages,syncLanguages,content};
})();
