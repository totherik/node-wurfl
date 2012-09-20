node-wurfl
==========

A NodeJS WURFL Cloud Client


Usage
==========

```javascript

var client = Wurfl.createClient({ apiKey: '%wurflApiKey%' });
client.getCapabilities(request, function (err, capabilities) {

	console.log(capabilities.is_tablet); // true or false

});

```