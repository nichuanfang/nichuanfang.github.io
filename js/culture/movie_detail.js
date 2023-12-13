$(document).ready(function(){if(document.querySelector("#movie-detail-container")){function e(e){var t=parseFloat(e)/2;if(t>4.3){t=5}var a=parseInt(t);var i=t-a;var s=5-a-Math.ceil(i);var l="";var o="";for(var n=0;n<a;n++){l+="★"}for(var n=0;n<i;n++){l+="☆"}for(var n=0;n<s;n++){o+="☆"}return[l,o]}function l(e){const t=/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;return t.test(e)}var t=window.location.search.split("=")[1];var s={};$.ajax({url:"https://api.jaychou.site/trakt/movie/"+t,type:"GET",dataType:"json",async:false,success:function(e){s=e.data},error:function(e){console.log(e)}});stars=e(s.rating);if(s.share_link==""){target_placeholder="";open_link="#"}else{target_placeholder='target="_blank"';open_link=s.share_link}var o=`
        <div class="movie-detail-media">
        <a target="_blank" class="movie-detail-media-cover-link" href="https://www.themoviedb.org/movie/${s.movie_id}">
            <div class="movie-detail-media-cover" style="background-image: url('https://www.themoviedb.org/t/p/w300_and_h450_bestv2${s.cover_image_url}');"></div>
        </a>
        <div class="movie-detail-media-meta">
            <div class="movie-detail-media-meta-item title">
            <a class="title-link" target="_blank" href="https://www.themoviedb.org/movie/${s.movie_id}">${s.movie_name}</a>
            </div>
            <div class="movie-detail-media-meta-item">
            <span class="author">${s.area} ${s.release_year}</span>
            <span class="star-score">${stars[0]}<span class="grey-star">${stars[1]}</span></span>
            <span class="link"><a href="${open_link}" ${target_placeholder}><i class="fas fa-external-link-alt"></i>打开</a></span>
            <span class="copy"><a href="#"><i class="fas fa-copy"></i>复制</a></span>
            <span class="edit"><a href="#"><i class="fas fa-edit"></i>更新</a></span>
            </div>
            <div class="movie-detail-media-meta-item intro-title">剧情简介</div>
            <div class="movie-detail-media-meta-item intro">
            ${s.movie_description}
            </div>
        </div>
        </div>
    `;var n=document.getElementById("movie-detail-container");n.innerHTML=o;const d=document.querySelector(".link a");var r=document.querySelector(".movie-detail-media-meta-item .copy a");if(d.getAttribute("href")=="#"){r.classList.add("disabled");d.classList.add("disabled");r.style.color="#999";d.style.color="#999"}let a=false;let i;r.addEventListener("click",async e=>{e.preventDefault();if(open_link!="#"){try{if(a){return}await navigator.clipboard.writeText(open_link);clearTimeout(i);const t=r.innerHTML;r.innerHTML='已复制<i class="fas fa-check"></i>';r.style.color="green";a=true;i=setTimeout(()=>{r.innerHTML=t;r.style.color="";a=false},1e3)}catch(e){console.error("复制到剪贴板失败:",e)}}});const c=document.querySelector(".movie-detail-media-meta-item .edit a");c.addEventListener("click",e=>{e.preventDefault();const a=document.createElement("div");a.className="input-box";a.style.position="fixed";a.style.top="50%";a.style.left="50%";a.style.transform="translate(-50%, -50%)";a.style.backgroundColor="#607D8B";a.style.padding="20px";a.style.border="1px solid #212529";a.style.boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)";a.style.zIndex="9999";a.style.width="400px";const i=document.createElement("input");i.type="text";i.placeholder="请输入URL";i.style.width="100%";i.style.marginBottom="10px";a.appendChild(i);const t=document.createElement("button");t.textContent="确认";t.style.float="right";a.appendChild(t);const s=document.createElement("button");s.textContent="取消";s.style.float="right";s.style.marginRight="10px";a.appendChild(s);document.body.appendChild(a);i.focus();t.addEventListener("click",()=>{const e=i.value;if(!l(e)){i.placeholder="URL无效!";i.value="";i.focus()}else{document.body.removeChild(a);const t=c.innerHTML;c.innerHTML='已更新 <i class="fas fa-check"></i>';c.style.color="green";setTimeout(()=>{c.innerHTML=t;c.style.color=""},1e3);if(a&&a.parentNode){a.parentNode.removeChild(a)}d.setAttribute("href",e);d.classList.remove("disabled");d.style.color="";d.setAttribute("target","_blank");r.classList.remove("disabled");r.style.color="";open_link=e}});s.addEventListener("click",()=>{document.body.removeChild(a)});i.addEventListener("keydown",e=>{if(e.key==="Enter"){t.click();e.preventDefault()}})})}});