 var gulp  = require ('gulp'),
			$=require("gulp-load-plugins")(),
			 browserify = require('browserify'),
			 source = require('vinyl-source-stream');

/*活动模板*/
gulp.task('convertJS', function(){
  return gulp.src(['./hd/template5/assets/javascripts/!(*.min).js'])
    .pipe($.babel({
      presets: ['es2015']
    }))
   .pipe($.uglify())
   .pipe($.rename({suffix: '.min'}))   //rename压缩后的文件名
    .pipe(gulp.dest('./hd/template5/assets/javascripts/'))
});

gulp.task("js",function(){
  gulp.src(['./hd/assets/javascripts/liuzis.js','./hd/assets/javascripts/alerts.js','./hd/assets/javascripts/turntableA.js'])  
      .pipe($.babel({
          presets: ['es2015']
        }))
      .pipe($.uglify())
      .pipe($.rename({suffix: '.min'}))   //rename压缩后的文件名
      .pipe(gulp.dest('./hd/assets/javascripts/'));  
});

// 解析css
gulp.task("css",function () {
  gulp.src("./hd/template5/assets/stylesheets/*.scss")
  .pipe($.sass())
  .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0'],
      cascade: true, //是否美化属性值 默认：true
      remove:true //是否去掉不必要的前缀 默认：true
  }))
 // .pipe(gulp.dest('./hd/template5/assets/stylesheets/'))
  .pipe( $.minifyCss() )
  .pipe($.rename({suffix: '.min'}))   //rename压缩后的文件名
  .pipe( gulp.dest("./hd/template5/assets/stylesheets/"))
})

gulp.task("alertcss",function () {
  gulp.src("./hd/assets/stylesheets/alert_box/*.scss")
  .pipe($.sass())
  .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0'],
      cascade: true, //是否美化属性值 默认：true
      remove:true //是否去掉不必要的前缀 默认：true
  }))
 // .pipe(gulp.dest('./hd/template5/assets/stylesheets/'))
  .pipe( $.minifyCss() )
  .pipe($.rename({suffix: '.min'}))   //rename压缩后的文件名
  .pipe( gulp.dest("./hd/assets/stylesheets/alert_box/"))
})
gulp.task("reload",function () {
  gulp.src([
    "./hd/template5/assets/stylesheets/*.css",
    "./hd/assets/stylesheets/alert_box/*.css",
    "./hd/template5/*.html"
    ])
  .pipe($.connect.reload())
})
//开启服务器
gulp.task("webserver",function () {
  $.connect.server({
    port : "2222",
    livereload : true,
    root: "./"
  })
})

gulp.watch([
  "./hd/template5/assets/stylesheets/*.scss",
  "./hd/assets/stylesheets/alert_box/*.scss"
],["css","alertcss","reload"])//关联文件

gulp.watch([
  "./hd/template5/assets/javascripts/*.js",
  "./hd/assets/javascripts/liuzis.js",
  "./hd/assets/javascripts/alert.js"
  ],['convertJS','js',"reload"])//关联文件

gulp.watch([
"./hd/template5/*.html",
],["reload"])//关联文件

gulp.task("default",["css","alertcss","convertJS","js","webserver"])

//网易云信
//压缩js  
// gulp.task("jss",function(){  
//     // 把1.js和2.js合并压缩为main.js,输出到dist/js目录下  
//     gulp.src('./hd/assets/javascripts/wangyi_yunxin/*.js')  
//         .pipe($.concat('im.min.js'))  
//         .pipe($.uglify())  
//         .pipe(gulp.dest('./hd/assets/javascripts/'));  
// }); 
// //压缩css  
// gulp.task('css', function() {  
//     gulp.src('./hd/assets/stylesheets/wangyi_yunxin/*.css')    //- 需要处理的css文件，放到一个字符串数组里  
//         .pipe($.concat('im.min.css'))                               //- 合并后的文件名  
//         .pipe($.minifyCss())                                      //- 压缩处理成一行  
//         .pipe(gulp.dest('./hd/assets/stylesheets/'));                             //- 输出文件本地;  
// });
// gulp.watch([
// './hd/assets/javascripts/wangyi_yunxin/*.js',
// './hd/assets/javascripts/wangyi_yunxin/*/*.js'
// ],["jss"])//关联文件

// gulp.task("webserver",function () {
//   $.connect.server({
//     port : "2222",
//     livereload : true,
//     root: "./"
//   })
// })
// gulp.task("default",["jss",'css',"webserver"])


//留资入口
/*gulp.task("js",function(){
    gulp.src('./hd/assets/javascripts/liuzi.js')  
        .pipe($.babel({
            presets: ['es2015']
          }))
        .pipe($.uglify())
        .pipe($.rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(gulp.dest('./hd/assets/javascripts/'));  
});

gulp.watch([
'./hd/assets/javascripts/liuzi.js'
],["js"])//关联文件

gulp.task("webserver",function () {
  $.connect.server({
    port : "2222",
    livereload : true,
    root: "./"
  })
})
gulp.task("default",["js","webserver"])*/

//压缩图片
// gulp.task('testImagemin', function () {
//   gulp.src('./hd/template5/assets/images/*.{png,jpg,gif,ico}')
//       .pipe($.imagemin())
//       .pipe(gulp.dest('./hd/template5/dist'));
// });
// gulp.task("default",["testImagemin"])
