var client = new Keen({
    projectId: '56e9fcfd2fd4b1443769623f',
    writeKey: 'a32a54423459de036d6dce165e983976b61e71a1f6e5e8d0cc632fa2c456c39be129a8aa553989cc1d2fe143ace6afc877321ba8ad2b66e66025c80cbc45040f1689697e0b4b7130618175c77ab3e5ac70ae1edba5ca0bc2c50901dd401a4351'
});

var sessionCookie = Keen.utils.cookie('takocat-cookie');
if (!sessionCookie.get('user_id')) {
    sessionCookie.set('user_id', Keen.helpers.getUniqueId());
}

var sessionTimer = Keen.utils.timer();
sessionTimer.start();

// THE BIG DATA MODEL!

client.extendEvents(function(){
    return {
        page: {
            title: document.title,
            url: document.location.href
            // info: {} (add-on)
        },
        referrer: {
            url: document.referrer
            // info: {} (add-on)
        },
        tech: {
            browser: Keen.helpers.getBrowserProfile(),
            // info: {} (add-on)
            ip: '${keen.ip}',
            ua: '${keen.user_agent}'
        },
        time: Keen.helpers.getDatetimeIndex(),
        visitor: {
            id: sessionCookie.get('user_id'),
            time_on_page: sessionTimer.value()
        },
        // geo: {} (add-on)
        keen: {
            timestamp: new Date().toISOString(),
            addons: [
                {
                    name: 'keen:ip_to_geo',
                    input: {
                        ip: 'tech.ip'
                    },
                    output: 'geo'
                },
                {
                    name: 'keen:ua_parser',
                    input: {
                        ua_string: 'tech.ua'
                    },
                    output: 'tech.info'
                },
                {
                    name: 'keen:url_parser',
                    input: {
                        url: 'page.url'
                    },
                    output: 'page.info'
                },
                {
                    name: 'keen:referrer_parser',
                    input: {
                        page_url: 'page.url',
                        referrer_url: 'referrer.url'
                    },
                    output: 'referrer.info'
                }
            ]
        }
    };
});

client.recordEvent('pageview');
