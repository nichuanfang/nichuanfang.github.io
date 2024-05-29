$(document).ready(function(){if(document.querySelector("#show-detail-container")){function e(e){var t=parseFloat(e)/2;if(t>4.3){t=5}var a=parseInt(t);var s=t-a;var i=5-a-Math.ceil(s);var o="";var l="";for(var r=0;r<a;r++){o+="★"}for(var r=0;r<s;r++){o+="☆"}for(var r=0;r<i;r++){l+="☆"}return[o,l]}function o(e){const t=/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;return t.test(e)}var t=window.location.search.split("=")[1];var l={};$.ajax({url:"https://api.jaychou.site/trakt/show/"+t,type:"GET",dataType:"json",async:false,success:function(e){l=e.data},error:function(e){console.log(e)}});var i=e(l.rating);if(l.share_link==""){var r="";var n="#"}else{var r='target="_blank"';var n=l.share_link}var d=`
        <div class="show-detail-media">
        <a target="_blank" class="show-detail-media-cover-link" href="https://www.themoviedb.org/tv/${l.show_id}">
            <div class="show-detail-media-cover" >
                  <img
                            srcset="/img/loading.gif"
                            lazyload
                            src="https://image.tmdb.org/t/p/w440_and_h660_face${l.cover_image_url}"
                            data-loaded="true"
                        />
            </div>
        </a>
        <div class="show-detail-media-meta">
            <div class="show-detail-media-meta-item title">
            <a class="title-link" target="_blank" href="https://www.themoviedb.org/tv/${l.show_id}">${l.show_name}</a>
            </div>
            <div class="show-detail-media-meta-item">
            <span class="author">${l.area} ${l.release_year}</span>
            <span class="star-score">${i[0]}<span class="grey-star">${i[1]}</span></span>
            <span class="link"><a href="${n}" ${r}><i class="fas fa-external-link-alt"></i>打开</a></span>
            <span class="copy"><a href="#"><i class="fas fa-copy"></i>复制</a></span>
            <span class="edit"><a href="#"><i class="fas fa-edit"></i>更新</a></span>
            </div>
            <div class="show-detail-media-meta-item show-progress">观看进度: ${l.season_progress}</div>
            <div class="show-detail-media-meta-item show-ended">剧集状态: ${l.is_ended?"完结":"未完结"}</div>
            <div class="show-detail-media-meta-item intro-title">剧情简介</div>
            <div class="show-detail-media-meta-item intro">
            ${l.show_description}
            </div>
        </div>
        </div>
    `;var c=document.getElementById("show-detail-container");c.innerHTML=d;for(const u of document.querySelectorAll("img[lazyload]")){Fluid.utils.waitElementVisible(u,function(){u.removeAttribute("srcset");u.removeAttribute("lazyload")},CONFIG.lazyload.offset_factor)}const h=document.querySelector(".link a");var m=document.querySelector(".show-detail-media-meta-item .copy a");if(h.getAttribute("href")=="#"){m.classList.add("disabled");h.classList.add("disabled");m.style.color="#999";h.style.color="#999"}let a=false;let s;m.addEventListener("click",async e=>{e.preventDefault();if(n!="#"){try{if(a){return}await navigator.clipboard.writeText(n);clearTimeout(s);const t=m.innerHTML;m.innerHTML='已复制<i class="fas fa-check"></i>';m.style.color="green";a=true;s=setTimeout(()=>{m.innerHTML=t;m.style.color="";a=false},1e3)}catch(e){console.error("复制到剪贴板失败:",e)}}});const p=document.querySelector(".show-detail-media-meta-item .edit a");p.addEventListener("click",e=>{e.preventDefault();const s=document.createElement("div");s.className="input-box";s.style.position="fixed";s.style.top="50%";s.style.left="50%";s.style.transform="translate(-50%, -50%)";s.style.backgroundColor="#607D8B";s.style.padding="20px";s.style.border="1px solid #212529";s.style.boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)";s.style.zIndex="9999";s.style.width="400px";const i=document.createElement("input");i.type="text";i.placeholder="请输入URL";i.style.width="100%";i.style.marginBottom="10px";s.appendChild(i);const t=document.createElement("button");t.textContent="确认";t.style.float="right";s.appendChild(t);const a=document.createElement("button");a.textContent="取消";a.style.float="right";a.style.marginRight="10px";s.appendChild(a);document.body.appendChild(s);i.focus();t.addEventListener("click",()=>{const a=i.value;if(!o(a)){i.placeholder="URL无效!";i.value="";i.focus()}else{$.ajax({url:"https://api.jaychou.site/trakt/update_show_share_link",type:"POST",dataType:"json",data:{show_id:l.show_id,share_link:a},success:function(e){if(e.code==200){const t=p.innerHTML;p.innerHTML='已更新 <i class="fas fa-check"></i>';p.style.color="green";setTimeout(()=>{p.innerHTML=t;p.style.color=""},1e3);if(s&&s.parentNode){s.parentNode.removeChild(s)}h.setAttribute("href",a);h.classList.remove("disabled");h.style.color="";h.setAttribute("target","_blank");m.classList.remove("disabled");m.style.color="";n=a}else{i.placeholder="更新失败!";i.value="";i.focus()}},error:function(e){console.log(e)}})}});a.addEventListener("click",()=>{document.body.removeChild(s)});i.addEventListener("keydown",e=>{if(e.key==="Enter"){t.click();e.preventDefault()}})})}});