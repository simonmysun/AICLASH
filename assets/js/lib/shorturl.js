function getUrl(str,cb) {
    gapi.client.setApiKey('AIzaSyBlJgUgEw895gv3pT1balcsj07orOK1sk0');
    gapi.client.load('urlshortener', 'v1', function() {
        gapi.client.urlshortener.url.insert({
            resource: {
                'longUrl': str
            }
        }).execute(function(response) {
            cb(response.id);
        });
    });
}
