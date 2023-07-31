const { loadNuxt, build } = require('nuxt')
const isDev = CONF.debug
let isbuild=false
async function start () {
	const nuxt = await loadNuxt({rootDir:'./nuxt',for:isDev ? 'dev' : 'start',configFile:'../nuxt.config.js'})
	if (isDev) {
		build(nuxt)
	}
	NEWMIDDLEWARE('nuxt', async function($) {
		var uri=$.req.uri
		var routes=Object.values(F.routes.all).map(a=>a.route)
		var route=routes.findItem(item=>item.name===uri.pathname)
		if(route)return $.next()
		var ext=nuxt.options.axios.baseURL
		if(!ext.startsWith('http')){
			nuxt.options.axios.baseURL=`${uri.origin}${ext}`
		}

		try{
			nuxt.render($.req,$.res);
		}catch(err){
			$.next()
		}
	},'*')
}
start()
//USE('*');