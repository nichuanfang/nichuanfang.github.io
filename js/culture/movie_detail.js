$(document).ready(function(){if(document.querySelector("#movie-detail-container")){function e(e){let t=parseFloat(e)/2;if(t>4.3)t=5;const a=parseInt(t);const i=t-a;const s=5-a-Math.ceil(i);return["★".repeat(a)+"☆".repeat(i),"☆".repeat(s)]}function n(e){const t=/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;return t.test(e)}const t=new URLSearchParams(window.location.search).get("tmdb_id");let o={};$.ajax({url:`https://api.chuanfang.org/trakt/movie/${t}`,type:"GET",dataType:"json",async:false,success:function(e){o=e.data},error:function(e){console.log(e)}});const s=e(o.rating);const r=o.share_link?'target="_blank"':"";var l=o.share_link||"#";const c=`
      <div class="movie-detail-media">
        <a target="_blank" class="movie-detail-media-cover-link" href="https://www.themoviedb.org/movie/${o.movie_id}">
          <div class="movie-detail-media-cover">
            <img srcset="/img/loading.gif" lazyload src="https://image.tmdb.org/t/p/w440_and_h660_face${o.cover_image_url}" data-loaded="true"/>
          </div>
        </a>
        <div class="movie-detail-media-meta">
          <div class="movie-detail-media-meta-item title">
            <a class="title-link" target="_blank" href="https://www.themoviedb.org/movie/${o.movie_id}">${o.movie_name}</a>
          </div>
          <div class="movie-detail-media-meta-item">
            <span class="author">${o.area} ${o.release_year}</span>
            <span class="star-score">${s[0]}<span class="grey-star">${s[1]}</span></span>
            <span class="link"><a href="${l}" ${r}><i class="fas fa-external-link-alt"></i>打开</a></span>
            <span class="copy"><a href="#"><i class="fas fa-copy"></i>复制</a></span>
            <span class="edit"><a href="#"><i class="fas fa-edit"></i>更新</a></span>
          </div>
          <div class="movie-detail-media-meta-item intro-title">剧情简介</div>
          <div class="movie-detail-media-meta-item intro">${o.movie_description}</div>
        </div>
      </div>
    `;const d=document.getElementById("movie-detail-container");d.innerHTML=c;document.querySelectorAll("img[lazyload]").forEach(e=>{Fluid.utils.waitElementVisible(e,()=>{e.removeAttribute("srcset");e.removeAttribute("lazyload")},CONFIG.lazyload.offset_factor)});const m=document.querySelector(".link a");const p=document.querySelector(".movie-detail-media-meta-item .copy a");if(m.getAttribute("href")=="#"){p.classList.add("disabled");m.classList.add("disabled");p.style.color="#999";m.style.color="#999"}let a=false;let i;p.addEventListener("click",async e=>{e.preventDefault();if(l!="#"){try{if(a)return;await navigator.clipboard.writeText(l);clearTimeout(i);const t=p.innerHTML;p.innerHTML='已复制<i class="fas fa-check"></i>';p.style.color="green";a=true;i=setTimeout(()=>{p.innerHTML=t;p.style.color="";a=false},1e3)}catch(e){console.error("复制到剪贴板失败:",e)}}});const u=document.querySelector(".movie-detail-media-meta-item .edit a");u.addEventListener("click",e=>{e.preventDefault();const i=document.createElement("div");i.className="input-box";i.style.cssText=`
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
      `;const s=document.createElement("input");s.type="text";s.placeholder="请输入URL";s.style.cssText="width: 100%; margin-bottom: 10px;";i.appendChild(s);const t=document.createElement("button");t.textContent="确认";t.style.float="right";i.appendChild(t);const a=document.createElement("button");a.textContent="取消";a.style.cssText="float: right; margin-right: 10px;";i.appendChild(a);document.body.appendChild(i);s.focus();t.addEventListener("click",()=>{const a=s.value;if(!n(a)){s.placeholder="URL无效!";s.value="";s.focus()}else{$.ajax({url:"https://api.chuanfang.org/trakt/update_movie_share_link",type:"POST",dataType:"json",data:{movie_id:o.movie_id,share_link:a},success:function(e){if(e.code==200){const t=u.innerHTML;u.innerHTML='已更新 <i class="fas fa-check"></i>';u.style.color="green";setTimeout(()=>{u.innerHTML=t;u.style.color=""},1e3);if(i&&i.parentNode){i.parentNode.removeChild(i)}m.setAttribute("href",a);m.classList.remove("disabled");m.style.color="";m.setAttribute("target","_blank");p.classList.remove("disabled");p.style.color="";l=a}else{s.placeholder="更新失败!";s.value="";s.focus()}},error:function(e){console.log(e)}})}});a.addEventListener("click",()=>{document.body.removeChild(i)});s.addEventListener("keydown",e=>{if(e.key==="Enter"){t.click();e.preventDefault()}})})}});