{"title":"","uid":"1cd19fc71517798e2fa5b7457d1fb06e","text":"(function () { if (typeof self === 'undefined' || !self.Prism || !self.document || !document.createElement) { return; } /** * The dependenci...","date":"2023-05-12T18:37:40.010Z","updated":"2023-05-12T18:37:40.010Z","comments":true,"path":"api/pages/js/prism-autoloader.js","covers":null,"excerpt":"","content":"(function () {\n\tif (typeof self === 'undefined' || !self.Prism || !self.document || !document.createElement) {\n\t\treturn;\n\t}\n\n\t/**\n\t * The dependencies map is built automatically with gulp.\n\t *\n\t * @type {Object<string, string | string[]>}\n\t */\n\tvar lang_dependencies = /*dependencies_placeholder[*/{\n\t\t\"javascript\": \"clike\",\n\t\t\"actionscript\": \"javascript\",\n\t\t\"apex\": [\n\t\t\t\"clike\",\n\t\t\t\"sql\"\n\t\t],\n\t\t\"arduino\": \"cpp\",\n\t\t\"aspnet\": [\n\t\t\t\"markup\",\n\t\t\t\"csharp\"\n\t\t],\n\t\t\"birb\": \"clike\",\n\t\t\"bison\": \"c\",\n\t\t\"c\": \"clike\",\n\t\t\"csharp\": \"clike\",\n\t\t\"cpp\": \"c\",\n\t\t\"coffeescript\": \"javascript\",\n\t\t\"crystal\": \"ruby\",\n\t\t\"css-extras\": \"css\",\n\t\t\"d\": \"clike\",\n\t\t\"dart\": \"clike\",\n\t\t\"django\": \"markup-templating\",\n\t\t\"ejs\": [\n\t\t\t\"javascript\",\n\t\t\t\"markup-templating\"\n\t\t],\n\t\t\"etlua\": [\n\t\t\t\"lua\",\n\t\t\t\"markup-templating\"\n\t\t],\n\t\t\"erb\": [\n\t\t\t\"ruby\",\n\t\t\t\"markup-templating\"\n\t\t],\n\t\t\"fsharp\": \"clike\",\n\t\t\"firestore-security-rules\": \"clike\",\n\t\t\"flow\": \"javascript\",\n\t\t\"ftl\": \"markup-templating\",\n\t\t\"gml\": \"clike\",\n\t\t\"glsl\": \"c\",\n\t\t\"go\": \"clike\",\n\t\t\"groovy\": \"clike\",\n\t\t\"haml\": \"ruby\",\n\t\t\"handlebars\": \"markup-templating\",\n\t\t\"haxe\": \"clike\",\n\t\t\"hlsl\": \"c\",\n\t\t\"java\": \"clike\",\n\t\t\"javadoc\": [\n\t\t\t\"markup\",\n\t\t\t\"java\",\n\t\t\t\"javadoclike\"\n\t\t],\n\t\t\"jolie\": \"clike\",\n\t\t\"jsdoc\": [\n\t\t\t\"javascript\",\n\t\t\t\"javadoclike\",\n\t\t\t\"typescript\"\n\t\t],\n\t\t\"js-extras\": \"javascript\",\n\t\t\"json5\": \"json\",\n\t\t\"jsonp\": \"json\",\n\t\t\"js-templates\": \"javascript\",\n\t\t\"kotlin\": \"clike\",\n\t\t\"latte\": [\n\t\t\t\"clike\",\n\t\t\t\"markup-templating\",\n\t\t\t\"php\"\n\t\t],\n\t\t\"less\": \"css\",\n\t\t\"lilypond\": \"scheme\",\n\t\t\"markdown\": \"markup\",\n\t\t\"markup-templating\": \"markup\",\n\t\t\"mongodb\": \"javascript\",\n\t\t\"n4js\": \"javascript\",\n\t\t\"nginx\": \"clike\",\n\t\t\"objectivec\": \"c\",\n\t\t\"opencl\": \"c\",\n\t\t\"parser\": \"markup\",\n\t\t\"php\": \"markup-templating\",\n\t\t\"phpdoc\": [\n\t\t\t\"php\",\n\t\t\t\"javadoclike\"\n\t\t],\n\t\t\"php-extras\": \"php\",\n\t\t\"plsql\": \"sql\",\n\t\t\"processing\": \"clike\",\n\t\t\"protobuf\": \"clike\",\n\t\t\"pug\": [\n\t\t\t\"markup\",\n\t\t\t\"javascript\"\n\t\t],\n\t\t\"purebasic\": \"clike\",\n\t\t\"purescript\": \"haskell\",\n\t\t\"qml\": \"javascript\",\n\t\t\"qore\": \"clike\",\n\t\t\"racket\": \"scheme\",\n\t\t\"jsx\": [\n\t\t\t\"markup\",\n\t\t\t\"javascript\"\n\t\t],\n\t\t\"tsx\": [\n\t\t\t\"jsx\",\n\t\t\t\"typescript\"\n\t\t],\n\t\t\"reason\": \"clike\",\n\t\t\"ruby\": \"clike\",\n\t\t\"sass\": \"css\",\n\t\t\"scss\": \"css\",\n\t\t\"scala\": \"java\",\n\t\t\"shell-session\": \"bash\",\n\t\t\"smarty\": \"markup-templating\",\n\t\t\"solidity\": \"clike\",\n\t\t\"soy\": \"markup-templating\",\n\t\t\"sparql\": \"turtle\",\n\t\t\"sqf\": \"clike\",\n\t\t\"swift\": \"clike\",\n\t\t\"t4-cs\": [\n\t\t\t\"t4-templating\",\n\t\t\t\"csharp\"\n\t\t],\n\t\t\"t4-vb\": [\n\t\t\t\"t4-templating\",\n\t\t\t\"vbnet\"\n\t\t],\n\t\t\"tap\": \"yaml\",\n\t\t\"tt2\": [\n\t\t\t\"clike\",\n\t\t\t\"markup-templating\"\n\t\t],\n\t\t\"textile\": \"markup\",\n\t\t\"twig\": \"markup\",\n\t\t\"typescript\": \"javascript\",\n\t\t\"vala\": \"clike\",\n\t\t\"vbnet\": \"basic\",\n\t\t\"velocity\": \"markup\",\n\t\t\"wiki\": \"markup\",\n\t\t\"xeora\": \"markup\",\n\t\t\"xml-doc\": \"markup\",\n\t\t\"xquery\": \"markup\"\n\t}/*]*/;\n\n\tvar lang_aliases = /*aliases_placeholder[*/{\n\t\t\"html\": \"markup\",\n\t\t\"xml\": \"markup\",\n\t\t\"svg\": \"markup\",\n\t\t\"mathml\": \"markup\",\n\t\t\"ssml\": \"markup\",\n\t\t\"atom\": \"markup\",\n\t\t\"rss\": \"markup\",\n\t\t\"js\": \"javascript\",\n\t\t\"g4\": \"antlr4\",\n\t\t\"adoc\": \"asciidoc\",\n\t\t\"shell\": \"bash\",\n\t\t\"shortcode\": \"bbcode\",\n\t\t\"rbnf\": \"bnf\",\n\t\t\"oscript\": \"bsl\",\n\t\t\"cs\": \"csharp\",\n\t\t\"dotnet\": \"csharp\",\n\t\t\"coffee\": \"coffeescript\",\n\t\t\"conc\": \"concurnas\",\n\t\t\"jinja2\": \"django\",\n\t\t\"dns-zone\": \"dns-zone-file\",\n\t\t\"dockerfile\": \"docker\",\n\t\t\"eta\": \"ejs\",\n\t\t\"xlsx\": \"excel-formula\",\n\t\t\"xls\": \"excel-formula\",\n\t\t\"gamemakerlanguage\": \"gml\",\n\t\t\"hs\": \"haskell\",\n\t\t\"gitignore\": \"ignore\",\n\t\t\"hgignore\": \"ignore\",\n\t\t\"npmignore\": \"ignore\",\n\t\t\"webmanifest\": \"json\",\n\t\t\"kt\": \"kotlin\",\n\t\t\"kts\": \"kotlin\",\n\t\t\"tex\": \"latex\",\n\t\t\"context\": \"latex\",\n\t\t\"ly\": \"lilypond\",\n\t\t\"emacs\": \"lisp\",\n\t\t\"elisp\": \"lisp\",\n\t\t\"emacs-lisp\": \"lisp\",\n\t\t\"md\": \"markdown\",\n\t\t\"moon\": \"moonscript\",\n\t\t\"n4jsd\": \"n4js\",\n\t\t\"nani\": \"naniscript\",\n\t\t\"objc\": \"objectivec\",\n\t\t\"objectpascal\": \"pascal\",\n\t\t\"px\": \"pcaxis\",\n\t\t\"pcode\": \"peoplecode\",\n\t\t\"pq\": \"powerquery\",\n\t\t\"mscript\": \"powerquery\",\n\t\t\"pbfasm\": \"purebasic\",\n\t\t\"purs\": \"purescript\",\n\t\t\"py\": \"python\",\n\t\t\"rkt\": \"racket\",\n\t\t\"rpy\": \"renpy\",\n\t\t\"robot\": \"robotframework\",\n\t\t\"rb\": \"ruby\",\n\t\t\"sh-session\": \"shell-session\",\n\t\t\"shellsession\": \"shell-session\",\n\t\t\"smlnj\": \"sml\",\n\t\t\"sol\": \"solidity\",\n\t\t\"sln\": \"solution-file\",\n\t\t\"rq\": \"sparql\",\n\t\t\"t4\": \"t4-cs\",\n\t\t\"trig\": \"turtle\",\n\t\t\"ts\": \"typescript\",\n\t\t\"tsconfig\": \"typoscript\",\n\t\t\"uscript\": \"unrealscript\",\n\t\t\"uc\": \"unrealscript\",\n\t\t\"vb\": \"visual-basic\",\n\t\t\"vba\": \"visual-basic\",\n\t\t\"xeoracube\": \"xeora\",\n\t\t\"yml\": \"yaml\"\n\t}/*]*/;\n\n\t/**\n\t * @typedef LangDataItem\n\t * @property ","count_time":{"symbolsCount":"4.4k","symbolsTime":"4 mins."},"toc":""}