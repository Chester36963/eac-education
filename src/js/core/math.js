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
  return {clear,render,bindLanguages,syncLanguages};
})();
