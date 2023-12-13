$(document).ready(function(){if(document.querySelector("#movie-detail-container")){var a=window.location.search.split("=")[1];var e={};$.ajax({url:"https://api.jaychou.site/trakt/movie/"+a,type:"GET",dataType:"json",async:false,success:function(a){e=a.data},error:function(a){console.log(a)}});var i=`
        <div class="movie-detail-media">
        <a target="_blank" class="movie-detail-media-cover-link" href="https://www.themoviedb.org/movie/${e.movie_id}">
            <div class="movie-detail-media-cover" style="background-image: url('https://www.themoviedb.org/t/p/w300_and_h450_bestv2${e.cover_image_url}');"></div>
        </a>
        <div class="movie-detail-media-meta">
            <div class="movie-detail-media-meta-item title">
            <a class="title-link" target="_blank" href="https://www.themoviedb.org/movie/${e.movie_id}">${e.movie_name}</a>
            </div>
            <div class="movie-detail-media-meta-item">
            <span class="author">${e.area} ${e.release_year}</span>
            <span class="star-score">${e.rating}<span class="grey-star">☆</span></span>
            <span class="link"><a href="#"><i class="fas fa-external-link-alt"></i>打开</a></span>
            <span class="copy"><a href="#"><i class="fas fa-copy"></i>复制</a></span>
            <span class="edit"><a href="#"><i class="fas fa-edit"></i>更新</a></span>
            </div>
            <div class="movie-detail-media-meta-item intro-title">剧情简介</div>
            <div class="movie-detail-media-meta-item intro">
            ${e.movie_description}
            </div>
        </div>
        </div>
    `;var t=document.getElementById("movie-detail-container");t.innerHTML=i}});