$(document).ready(function(){if(document.querySelector("#show-detail-container")){function e(e){const t=Math.min(parseFloat(e)/2,5);const a=Math.floor(t);const s=t%1>=.5?1:0;const i=5-a-s;return["★".repeat(a)+"☆".repeat(s),"☆".repeat(i)]}function n(e){const t=/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;return t.test(e)}const t=new URLSearchParams(window.location.search).get("tmdb_id");let o={};$.ajax({url:`https://api.chuanfang.org/trakt/show/${t}`,type:"GET",dataType:"json",async:false,success:function(e){o=e.data},error:function(e){console.log(e)}});const i=e(o.rating);const r=o.share_link?'target="_blank"':"";var l=o.share_link||"#";const d=`
            <div class="show-detail-media">
                <a target="_blank" class="show-detail-media-cover-link" href="https://www.themoviedb.org/tv/${o.show_id}">
                    <div class="show-detail-media-cover">
                        <img
                            srcset="/img/loading.gif"
                            lazyload
                            src="https://image.tmdb.org/t/p/w440_and_h660_face${o.cover_image_url}"
                            data-loaded="true"
                        />
                    </div>
                </a>
                <div class="show-detail-media-meta">
                    <div class="show-detail-media-meta-item title">
                        <a class="title-link" target="_blank" href="https://www.themoviedb.org/tv/${o.show_id}">${o.show_name}</a>
                    </div>
                    <div class="show-detail-media-meta-item">
                        <span class="author">${o.area} ${o.release_year}</span>
                        <span class="star-score">${i[0]}<span class="grey-star">${i[1]}</span></span>
                        <span class="link"><a href="${l}" ${r}><i class="fas fa-external-link-alt"></i>打开</a></span>
                        <span class="copy"><a href="#"><i class="fas fa-copy"></i>复制</a></span>
                        <span class="edit"><a href="#"><i class="fas fa-edit"></i>更新</a></span>
                    </div>
                    <div class="show-detail-media-meta-item show-progress">观看进度: ${o.season_progress}</div>
                    <div class="show-detail-media-meta-item show-ended">剧集状态: ${o.is_ended?"完结":"未完结"}</div>
                    <div class="show-detail-media-meta-item intro-title">剧情简介</div>
                    <div class="show-detail-media-meta-item intro">
                        ${o.show_description}
                    </div>
                </div>
            </div>
        `;const c=document.getElementById("show-detail-container");c.innerHTML=d;document.querySelectorAll("img[lazyload]").forEach(e=>{Fluid.utils.waitElementVisible(e,()=>{e.removeAttribute("srcset");e.removeAttribute("lazyload")},CONFIG.lazyload.offset_factor)});const m=document.querySelector(".link a");const h=document.querySelector(".show-detail-media-meta-item .copy a");if(m.getAttribute("href")==="#"){h.classList.add("disabled");m.classList.add("disabled");h.style.color="#999";m.style.color="#999"}let a=false;let s;h.addEventListener("click",async e=>{e.preventDefault();if(l!=="#"){try{if(a)return;await navigator.clipboard.writeText(l);clearTimeout(s);const t=h.innerHTML;h.innerHTML='已复制<i class="fas fa-check"></i>';h.style.color="green";a=true;s=setTimeout(()=>{h.innerHTML=t;h.style.color="";a=false},1e3)}catch(e){console.error("复制到剪贴板失败:",e)}}});const p=document.querySelector(".show-detail-media-meta-item .edit a");p.addEventListener("click",e=>{e.preventDefault();const s=document.createElement("div");s.className="input-box";s.style.cssText=`
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #607D8B;
                padding: 20px;
                border: 1px solid #212529;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                width: 400px;
            `;const i=document.createElement("input");i.type="text";i.placeholder="请输入URL";i.style.width="100%";i.style.marginBottom="10px";s.appendChild(i);const t=document.createElement("button");t.textContent="确认";t.style.float="right";s.appendChild(t);const a=document.createElement("button");a.textContent="取消";a.style.float="right";a.style.marginRight="10px";s.appendChild(a);document.body.appendChild(s);i.focus();t.addEventListener("click",()=>{const a=i.value;if(!n(a)){i.placeholder="URL无效!";i.value="";i.focus()}else{$.ajax({url:"https://api.chuanfang.org/trakt/update_show_share_link",type:"POST",dataType:"json",data:{show_id:o.show_id,share_link:a},success:function(e){if(e.code===200){const t=p.innerHTML;p.innerHTML='已更新 <i class="fas fa-check"></i>';p.style.color="green";setTimeout(()=>{p.innerHTML=t;p.style.color=""},1e3);if(s&&s.parentNode){s.parentNode.removeChild(s)}m.setAttribute("href",a);m.classList.remove("disabled");m.style.color="";m.setAttribute("target","_blank");h.classList.remove("disabled");h.style.color="";l=a}else{i.placeholder="更新失败!";i.value="";i.focus()}},error:function(e){console.log(e)}})}});a.addEventListener("click",()=>{document.body.removeChild(s)});i.addEventListener("keydown",e=>{if(e.key==="Enter"){t.click();e.preventDefault()}})})}});