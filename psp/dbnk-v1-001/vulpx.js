//Vul code for testing

window._tfsc = window._tfsc || parent._tfsc;
if (window._tfsc && _tfsc.env) {
    //Do nothing as _tfsc.env already available
} else if (window._tfsc && typeof _tfsc.getPath === "function") {
    _tfsc.env = (function() {
        if (_tfsc.STAGING_URL.match(/(.*?)\//) &&
            _tfsc.getPath().match(/(.*?)\//)[1] === _tfsc.STAGING_URL.match(/(.*?)\//)[1])
            return 's';
        else if (_tfsc.PRODUCTION_URL.match(/(.*?)\//) &&
            _tfsc.getPath().match(/(.*?)\//)[1] === _tfsc.PRODUCTION_URL.match(/(.*?)\//)[1])
            return 'p';
        else
            return 'o';
    })();
} else if (location.href.match(/[&#\?]env=([pos])(\/|&|$)/)) {
    window._tfsc = {
        env: location.href.match(/[&#\?]env=([pos])(\/|&|$)/)[1],
        getPath: function() {
            if (location.href.match(/[&#\?]cdnPath=(.*?)(\/|&|$)/)) {
                return location.href.match(/[&#\?]cdnPath=(.*?)(\/|&|$)/)[1] + '/';
            } else {
                return location.host;
            }
        }
    };
} else {
    window._tfsc = {
        env: 'p'
    };
}

if (typeof SN === "undefined") {
    SN = {};
}

/**
 * @module PE
 * @submodule SD
 */
/**
 * A class containing all the Client specific configurations allowed by the
 * platform. Content of this class is to be edited by the Service Delivery team
 * according to client requirements before being used and deployed.
 *
 * @class SN.Conf
 * @static
 */
SN.Conf = (function() {

    /**
     * Returns the full url for a page id from a mapping defined by Service Delivery Group
     * The actual implementation of this method should be done when 247px.js is being configured for a client.
     *
     * @method getDecodedValue
     * @param {String} encodedValue The id of the page for which the url is required.
     * @example
     *      SN.Conf.getDecodedValue("id1");
     * @return {String} Page URL
     */
    function getDecodedValue(encodedValue) {
        // The actual implementation of this method should be done when 247px.js is being configured for a client.
        // Below is a sample implementation (in comments)
        //  switch (encodedValue) {
        //  case "<id1>":
        //      return "<client_page1>";
        //  case "<id2>":
        //      return "<client_page2>";
        //  default:
        //      return encodedValue;
        //  }
        return encodedValue;
    }
    /**
     * Returns an id corresponding to the current page url and the mapping
     * defined by Service Delivery Team.
     *
     * @method getUrlId
     * @example
     *      SN.Conf.getUrlId();
     * @return {String} Page URL
     */
    function getUrlId() {
        //The actual implementation of this method should be done when 247px.js is being configured for a client.
        //In the actual implementation, a specific id (max 2 characters) corresponding to the current page url should be returned.
        //Below (in comments) is a sample code on how to implement this method:
        var presentUrl = window.location.href;
        if (presentUrl.indexOf('testsite1') != -1)
            return "X";
        else if (presentUrl.indexOf('testsite2') != -1)
            return "Y";
        return "id";
    }

    function getSubtenantId() {
        //to be implemented during configuration.Below is a sample implementation
        var urlId = getUrlId();
        return pageidVSsubtenantMap[urlId];

    }

    function getOrderIDDetails()    {
        //to be defined by SD Dev
        // used to send order ID details in ENVNOTSUPPPORTED event
        // Function should return null when order id is not found
        return null;
    }

    var pspRoot = null;
    var cdnRoot = null;
    var assistvs = null;
    var assistca = null;
    var assistid = null;

    //to be used only to set store to cookie in Safari Private Browsing Scenario
    function setStoresToCookie() {
        this.dataStore = "cookie";
        this.viStore = "cookie";
    }


    function populatePSPandCDNRoot() {
        switch (_tfsc.env) {
            case 'p': //environment - PRODUCTION
                pspRoot = "tie.app.247-inc.net";
                cdnRoot = "d1af033869koo7.cloudfront.net";
                assistvs = "defencebank.vs.assist.247-inc.net";
                assistca = "defencebank.ca.assist.247-inc.net";
                assistid = "defencebank-account-default";
                break;
            case 's': //environment - STAGE
                pspRoot = "tie-stage.app.247-inc.net";
                cdnRoot = "d2j8jkom7xmn9n.cloudfront.net";
                assistvs = "defencebank.vs.assist.staging.247-inc.net";
                assistca = "defencebank.ca.assist.staging.247-inc.net";
                assistid = "defencebank-account-default";
                break;
            case 'o': //environment - other
            case 'd': //environment - other
            case 'q': //environment - other
                if(_tfsc.getPath().match(/(.*?)\//)[1] == "dev-sd.s3.amazonaws.com"){
                    _tfsc.env = 'd';
                }else if(_tfsc.getPath().match(/(.*?)\//)[1] == "sd-qa.s3.amazonaws.com"){
                     _tfsc.env = 'q';
                }else{
                    // do nothing
                }      
                pspRoot = "tie-stage.app.247-inc.net";
                cdnRoot = _tfsc.getPath().match(/(.*?)\//)[1];
                assistvs = "defencebank.vs.assist.staging.247-inc.net";
                assistca = "defencebank.ca.assist.staging.247-inc.net";
                assistid = "defencebank-account-default";
                break;
        }
    }

    //   The actual configuration  for subtenant array of this method should be done when 247px.js is being configured for a client.
    //   Each urlId that could be returned by getUrlId() needs to be mapped with its subtenant id or own array of subtenants.
    //   Below is a sample implementation (in comments)
    var pageidVSsubtenantMap = {
        //"X"   : "subtenant1",
        //"Y"   : "subtenant2",
        "id": "nemo-client-defencebank"
    };
    var viStore = "cookie";
    var dataStore = "localstorage";

	populatePSPandCDNRoot();
    function setConfFromCookie() {
        try {
            var confCookie = JSON.parse(_tfsc.j("sn.conf"));
            if(confCookie){
                if(confCookie.tie && confCookie.tie.val){
                    pspRoot = confCookie.tie.val;
                }
                if(confCookie.aca && confCookie.aca.val){
                    assistca = confCookie.aca.val;
                }
                if(confCookie.avs && confCookie.avs.val){
                    assistvs = confCookie.avs.val;
                }
            }
        }
        catch(e){
            if(window.console && console.log){
                console.log("SN.Conf.setConfFromCookie.error -> " + e.message.toString());
            }
        }
    }
    setConfFromCookie();

    return {


//        CONST_PSP_KEY : "demo-v1-001",
//        CONST_CDN_VERSION : "v0.1",
        CONST_PSP_KEY: "defencebank-v1-001",
        CONST_CDN_VERSION: "20190823003422",     //change cdn version accordingly.
        COOKIEPATH : ['defencebank.com.au'],         //change it to client domain where we want to set the cookie.(array of domains)
        tnt : "nemo-client-defencebank",


        working_hours: {
            "monday_start": "9",
            "monday_end": "18",
            "tuesday_start": "9",
            "tuesday_end": "18",
            "wednesday_start": "9:20",
            "wednesday_end": "18:30",
            "thursday_start": "9",
            "thursday_end": "20:30",
            "friday_start": "9",
            "friday_end": "18",
            "saturday_start": "9",
            "saturday_end": "18",
            "sunday_start": "9",
            "sunday_end": "18"
        },
        timezone: '+5:30', //Agent side Time Zone used for checking wworking hours


        // Conf related to feature :- Visitor ID Based on FPID
        fpidInServer: false,                    //True if the fpid feature is to be active for the client
        fpidFeatureActiveBrowsers: ["s"],       //value should be s/f/c/i
        customStoresAndLifeTimesToBeRegistered: { //"custom store name" : store lifetime in seconds
            // "custom store name" : lifetime of store in seconds
            // "sn.c1" : 3600,
            // "sn.c2" : 600
        },
        /*
         * When ds = server or fpid feature is active, the underlyingDataMngr would be ServerStorageManger.
         * In this scenario, cookies as well as
         *these should be list of the custom stores to be cleaned up from cookiestorage and localstorage
         * standard stores will be handled separately
         * eg : ["sn.cfv", "sn.ct"]
         */
        CustomStoresToBeCleanedUp: [/*"sn.cfv", "sn.c1"*/],

        //Add to the below, for blacklisting specific versions of whitelisted(by platform) browsers
        // This will be an array of blacklisted versions; eg : - if its - ["14.0.1", "13.1.2"], neither of them would be supported. Similarily for others
        blackListedVersions_browsers :  {
            browserLevel : [],  //Array of browsers to be blacklisted from the platform whitelisted group( "Firefox", "Android", "Version" , "Chrome", "CriOS", "MSIE")
            Firefox : [],
            Android : [],       //android webkit browser
            Version : [],       //Safari
            Chrome : [],
            CriOS : [],         //Chrome on IOS
            MSIE : ["8"]
        },
        blackListedVersions_OS : {
            OSLevel : [],       //Array of OS' to be blacklisted from the platform whitelisted group("Windows", "Android" , "Linux", "MacOS", "iOS")
            Windows : [],
            Android : [],       //for blocking all patches for a particular version, say - 4.3 and 4.3.1 , use "4.3.x"
            Linux : [],
            MacOS : [],
            iOS : []

        },
        blacklistedDeviceTypes : [],    //Array of DeviceTypes to be blacklisted ("M", "T", "D", "U" for mobiles, tablets, desktops, unknown respectively

        //tracking related
        trackingSecured : false,        //default : false, make it to true to force https for pxt.js calls
        pluginsToBeTracked: false, //default: false, this flag should be set to true if navigator.plugins is to be tracked in Session Start Event
        mimeTypesToBeTracked: false, //default: false, this flag should be set to true if navigator.mimeTypes is to be tracked in Session Start Event
        browserGeoLocationFlag : false,         //true => browser, false => position returned by server
        trackingUrlFlag: false,
        varMapFlag: false,
        varmap: {
            // "<key>": "<value>"
        },
        earlyPageLoadEventRequired: false, //enable this to fire the early PL event
        earlyPageLoadED: {
            //add extra data here to be captured for early page load event
            // by default : vi, ec(100000), userAgent, currentPageUrl and other standard tracked variables are captured
            //sample below. The map can be left empty too
            //epl_ed_1 : "random value",
            //epl_ed_2 : new Date().getTime()
        },

        ACTIVE_SESSION_ID_SEED : 1,
        startRunPollAuto : false,    //disable this to stop run calls. default : false. Use utils.setPollerStartToAuto to control the setting
        RUN_CALL_POLLER_TIMEOUT : 300000,    //Time out parameter for poller function in controller which handles run rules post calls.(milliseconds)
        CONST_PSP_STAGE: "p", //p="prod" , t = "test"
        CONST_PSP_VERSION: "default",
        CUSTOM_TRACKING_PERCENTAGE: 100,

        IS_DS_REQUIRED: false,
        DS_dataStore : "localstorage", //"cookie" or "localstorage"
        DECISION_LIFETIME : 3600,   // lifetime in seconds, default : 3600
        TEST_PERCENTAGE: 0, //This is percentage for test visitors.For example:TEST_PERCENTAGE : 30
        BYPASS_PERCENTAGE: 0, //PXOE wont serve for this percentage visitor.For example BYPASS_PERCENTAGE : 30

        PEAK_HOUR_START: 0,
        PEAK_HOUR_STOP: 0, // eg: 13:30 => 1330, 06:00 => 0600
        OFFPEAK_BYPASS: 0, //percentage; if 30%, then 30% of the visitors will be decision_bypassed

        //store related
        isViStoreSession: false,

        /*      ADP_BASE_URL: {
         'uibuilder' :          'http://host13.pxassist.pool.sv2.247-inc.net/',
         'Gravity Form' :       'http://host126.assist.pool.sv2.247-inc.net/',
         'FAQ' :                'http://adp-host01.assist.pool.sv2.247-inc.net/app-mgmt-console/api/faq',
         'Guided Navigation' :  'http://adp-host01.assist.pool.sv2.247-inc.net/app-mgmt-console/api/gna',
         'CTC' :                'https://click2call.apps.247-inc.net',
         'Info':                'http://adp-host01.assist.pool.sv2.247-inc.net/app-mgmt-console/api/faq',
         'dss' :                'http://adp-host01.assist.pool.sv2.247-inc.net/app-mgmt-console/api/v1/dss',
         'Dss Get Instance' :    'http://adp-host01.assist.pool.sv2.247-inc.net/app-mgmt-console/api/v1/dss/getinstance'
         },*/
        IS_ADP_ENABLED : false,
        ADP_BASE_URL: {
            'uibuilder' :           'url for uibuilder',
            'Gravity Form' :        'url for gravity form',
            'FAQ' :                 'url for faq',
            'Guided Navigation' :   'url for gna',
            'CTC' :                 'url for click 2 call',
            'Info':                 'url for info , faq',
            'dss' :                 'url for dss',
            'Dss Get Instance' :    'url for dss/getinstance'
        },
        ADP_ACCOUNT_ID : 'defencebank-account-default',
        ADP_APP_ID: '8ac12771453be3b901453ce22e840001',
        ADP_APP_LIB_ID: '',
        //for decision, time_based_throttling


        /*addition for cookie enabling/disabling
         Put  comma separated cookies here, the cookies that are configured here will not be created,
         if the cookies in this list already exist, they will be deleted
         cookies that can be disabled :*/
        DISABLED_COOKIES: [],

        ED: {
            //Add Extra Data key and values here as required in the format of key : expression
        },


        stnt: getSubtenantId,
        pspRoot : pspRoot,
        cdnRoot : cdnRoot,
        getDecodedValue: getDecodedValue,
        getUrlId: getUrlId,
        getOrderIDDetails :getOrderIDDetails,
        setStoresToCookie :setStoresToCookie,
        dataStore : dataStore,      //dataStore can be either "server" or "cookie" or "localstorage"
        viStore : viStore,  // viStore can be "cookie" or "localstorage"
        CONST_ASSIST_VS_ROOT: assistvs,
        CONST_ASSIST_CA_ROOT: assistca,
        CONST_ASSIST_ACCOUNT_ID: assistid
    };

}());
/*1. customscript*/
/**
 * @identity customscript
 * @requires 247Conf
 */
if (typeof SN === "undefined") {
    SN = {};
}

/* Debug flags reader */
(function() {
    if (!localStorage.debug247) return;

    try{
        var debug = JSON.parse(localStorage.debug247);
        for (var key in debug) {
            if (debug.hasOwnProperty(key)){
                SN.Conf[key] = debug[key];
            }
        }
    } catch(err) {
        if (console && console.log) {
            console.log('Debug Error: ' + err);
        }
    }
})();
/* End of debug flag reader */

/* jshint laxcomma: true */
SN.CustomScript = function() {
    var iframeElement = document.getElementById("sn_iframe");
    if (SN.Utils.undefinedOrNull(iframeElement)) {
        iframeElement = window;
    }

    var iframeContentWindow = iframeElement.contentWindow;
    var utils = iframeContentWindow.SN.Utils;
    var SN_CONSTANTS = iframeContentWindow.SN.Constants;
    var pspCustomTrackingUtil = iframeContentWindow.SN.PSPCustomTrackingUtil;

    /*
     * custom tracking log levels
     */
    var LOGLVL_NONE = 1000;
    var LOGLVL_ERROR = 400;
    var LOGLVL_INFO = 200;
    var LOGLVL_DEBUG = 100;


    /*------------filter related variables----------*/
    var webpageFilter = iframeContentWindow.SN.WebPageFilter;
    var filterType = webpageFilter.filterTypeEnum.NONE;
    var includeFilterMap = {};
    var excludeFilterMap = {};
    var includeFilterRegexList = [];
    var excludeFilterRegexList = [];
    /*-----end of filter related variables----------*/
    function customInitialization() {

        var parentDomain = window.documentDomain;
        if (parentDomain && parentDomain != document.domain) {
            document.domain = parentDomain;
        }

        utils.setPollerStartToAuto(SN.Conf.startRunPollAuto);
        utils.setCrossDomainSupported(true);
        utils.setPSPServerName(SN.Conf.CONST_PSP_ROOT);
        utils.setPSPCDNServerName(SN.Conf.CONST_PSP_CDN_ROOT);
//      utils.setPSPStage(SN.Conf.CONST_PSP_STAGE);//this api is depricated, and CONST_PSP_STAGE can be set in SN.Conf
        utils.setClientKey(SN.Conf.CONST_PSP_KEY);
        utils.setProxyServer(SN.Conf.PROXY_SERVER);

        utils.setCustomTrackServer(SN.Conf.CUSTOM_TRACK_SERVER);
        utils.setCustomTrackingLevel(LOGLVL_ERROR);
        utils.setPsdxdPath(SN.Conf.pspxdPath);

        //registering custom stores and their lifetimes
        var customStoresAndLifeTimesToBeRegistered = SN.Conf.customStoresAndLifeTimesToBeRegistered;
        for(var customStore in customStoresAndLifeTimesToBeRegistered)  {
            if(customStoresAndLifeTimesToBeRegistered.hasOwnProperty(customStore))
                utils.setStoreLifetime(customStore, customStoresAndLifeTimesToBeRegistered[customStore]);

        }

        webpageFilter.setFilterType(filterType);
        webpageFilter.setInfilters(includeFilterMap);
        webpageFilter.setOutfilters(excludeFilterMap);
        webpageFilter.setInfilterRegexList(includeFilterRegexList);
        webpageFilter.setOutfilterRegexList(excludeFilterRegexList);

        if(utils.isDomready()){
            setupExitHistory();
        }else{
            iframeContentWindow.SN.EventManager.observe(SN_CONSTANTS.DOMLOADED,setupExitHistory);
        }
        iframeContentWindow.SN.EventManager.fire(SN_CONSTANTS.CUSTOM_INITIALIZATION_COMPLETED, {eventId : SN_CONSTANTS.CUSTOM_INITIALIZATION_COMPLETED});
        pspCustomTrackingUtil.setTrackingVariableMap(SN.Conf.varmap);
        pspCustomTrackingUtil.startPoller(SN.Conf.pollingTime, SN.Conf.varMapFlag, SN.Conf.trackingUrlFlag);

        /*  for Social integration */
        //initSocialwidget(); //enable this function when social integration required.
        //SN.Social.load();
    }

    /* UNCOMMENT IF REQUIRED */
    /* function initSocialwidget(){
        //sample template for implementing social plugin
        //For more info : https://docs.google.com/document/d/15XZU9DIo6ztH9z87_F1_tA7lNEb7hAdcOg3NXmqsskE/edit?usp=sharing
        var service_details = {
            'order_number' : '',
            'order_date' : '',
            'customer_email' : '',
            'service_name' : '',
            'is_debug' : true

        };

        var data = {};
        //data.store_id = SN.Conf.SOCIAL_STORE_ID;
        //data.service_details = service_details;
        //data.base_orl = SN.Conf.SOCIAL_BASE_URL;

        parent.social247AsyncInit = function() {
            parent.Shopalize.Loader.showSocialWidget('experience_sharing', data);
        };

    } */

    function setupExitHistory(){

        var elements = getElements();

        iframeContentWindow.SN.ExitHistory.registerElementsForExitLinkCapturing(elements);
    }

    function getElements(){
        var elements =[];
        elements[0] = parent.document.getElementById("yahoo");
        elements[1] = parent.document.getElementById("google");
        elements[1] = parent.document.getElementById("247inc");
        elements[1] = parent.document.getElementById("247inc-https");
        elements[1] = parent.document.getElementById("google-search");
        elements[1] = parent.document.getElementById("google-home");
        return elements;
    }

     /*------------to test pspcustomtracking--------

     var pspCustomTrackingUtil = SN.PSPCustomTrackingUtil;
     var varmap = {"lpchatvar" : "true"};
     pspCustomTrackingUtil.setTrackingVariableMap(varmap);
     pspCustomTrackingUtil.startPoller(pollingTime);

     /*-----------lpTracking----------*/

    function renderInitcall(key) {
        var eventContext = {
            eventId: "initialize",
            data: {
                psproot: "http://psp.247ilabs.com/psp",
                pspkey: SN.Conf.CONST_PSP_KEY,
                v: "default",
                pageid: "getPageIdExpression()",
                trackid: "getWebTrackIdExpression()",
                ps_timeout_mins: "0",
                conversionTrackingIdIS: "",
                wowpxAppConfigs: {},
                widgetconfigs: {},
                mappedrulevariables: [{
                    key: "TEMPLATE_NB_MODEL",
                    scope: "r"
                }, {
                    key: "mv_browserDetails",
                    scope: "r"
                }, {
                    key: "mv_chatInProgress",
                    scope: "r"
                }, {
                    key: "mv_countInviteInSession",
                    scope: "r"
                }, {
                    key: "mv_countInviteOnPage",
                    scope: "r"
                }, {
                    key: "mv_deviceDetails",
                    scope: "r"
                }, {
                    key: "mv_geo_ip",
                    scope: "r"
                }, {
                    key: "mv_initialReferrer",
                    scope: "r"
                }, {
                    key: "mv_inv_shown",
                    scope: "r"
                }, {
                    key: "mv_isButtonActive",
                    scope: "r"
                }, {
                    key: "mv_isInviteActive",
                    scope: "r"
                }, {
                    key: "mv_lp_url",
                    scope: "r"
                }, {
                    key: "mv_numberOfPagesVisited",
                    scope: "r"
                }, {
                    key: "mv_proactiveInviteTimediff",
                    scope: "r"
                }, {
                    key: "mv_rp_referrer",
                    scope: "r"
                }, {
                    key: "mv_rs_referrer",
                    scope: "r"
                }, {
                    key: "mv_suppressionTitles",
                    scope: "r"
                }, {
                    key: "mv_suppressionUrls",
                    scope: "r"
                }, {
                    key: "mv_timeOnSite",
                    scope: "r"
                }, {
                    key: "mv_tp_title",
                    scope: "r"
                }, {
                    key: "mv_ts_title",
                    scope: "r"
                }, {
                    key: "mv_up_url",
                    scope: "r"
                }, {
                    key: "mv_us_url",
                    scope: "r"
                }]
            }
        };
        iframeContentWindow.SN.EventManager.fire("pageevent", eventContext);
    }

    function getEncodedValue(value){
        /* UNCOMMENT IF REQUIRED */
        /* if(value == "http://247testsite.com/test.html"){
            return "h";
        }else if(value == "abcd type of product category"){
            return "a";
        }else if(value == "in.yahoo.com"){
            return "Y";
        }else if(value == "www.google.co.in"){
            return "G";
        }
        else{ */
            return value;
        /* } */
    }

    function getDecodedValue(encodedValue){
        /* UNCOMMENT IF REQUIRED */
        /* if(encodedValue == "h"){
            return "http://247testsite.com/test.html";
        }
        else if(encodedValue == "Y"){
            return "in.yahoo.com";
        }else if(encodedValue == "G"){
            return "www.google.co.in";
        }
        else{ */
            return encodedValue;
        /* } */

    }

    /* UNCOMMENT IF REQUIRED */
    /*
     Checks If it's working hour based on Agents working hour and client side time.
     */
    /* function checkAvailabilityByWorkingHours(){
        var working_hours = SN.Conf.working_hours,
            timezone = SN.Conf.timezone;
        if(working_hours === null || typeof working_hours === 'undefined' || timezone === null || typeof timezone === 'undefined'){
            return false;
        }

        var loc_dt_fr_client = new Date(),
        //Convert date to UTC date ie. remove timezone offset
            asd = new Date(loc_dt_fr_client.getUTCFullYear(), loc_dt_fr_client.getUTCMonth(), loc_dt_fr_client.getUTCDate(), loc_dt_fr_client.getUTCHours(), loc_dt_fr_client.getUTCMinutes(), loc_dt_fr_client.getSeconds()),
            day = 1,
            tz_hr,
            tz_mn,
            agent_side_date_of_client,
            start_time, end_time;

        if (timezone.charAt(0) === '-') {
            tz_hr = timezone.slice(1).split(':')[0] ? timezone.slice(1).split(':')[0] : 0;
            tz_mn = timezone.slice(1).split(':')[1] ? timezone.slice(1).split(':')[1] : 0;
            agent_side_date_of_client = new Date(asd.getFullYear(), asd.getMonth(), asd.getDate(), asd.getHours() - tz_hr, asd.getMinutes() - tz_mn, asd.getSeconds());
        } else if (timezone.charAt(0) === '+') {
            tz_hr = timezone.slice(1).split(':')[0] ? timezone.slice(1).split(':')[0] : 0;
            tz_mn = timezone.slice(1).split(':')[1] ? timezone.slice(1).split(':')[1] : 0;
            agent_side_date_of_client = new Date(asd.getFullYear(), asd.getMonth(), asd.getDate(), parseInt(asd.getHours(), 10) + parseInt(tz_hr, 10), parseInt(asd.getMinutes(), 10) + parseInt(tz_mn, 10), asd.getSeconds());
        } else {
            tz_hr = timezone.split(':')[0] ? timezone.slice(1).split(':')[0] : 0;
            tz_mn = timezone.split(':')[1] ? timezone.slice(1).split(':')[1] : 0;
            agent_side_date_of_client = new Date(asd.getFullYear(), asd.getMonth(), asd.getDate(), parseInt(asd.getHours(), 10) + parseInt(tz_hr, 10), parseInt(asd.getMinutes(), 10) + parseInt(tz_mn, 10), asd.getSeconds());
        }
        day = agent_side_date_of_client.getDay();
        switch(day) {
            case 0:
                start_time = working_hours.sunday_start;
                end_time = working_hours.sunday_end;
                break;
            case 1 :
                start_time = working_hours.monday_start;
                end_time = working_hours.monday_end;
                break;
            case 2 :
                start_time = working_hours.tuesday_start;
                end_time = working_hours.tuesday_end;
                break;
            case 3 :
                start_time = working_hours.wednesday_start;
                end_time = working_hours.wednesday_end;
                break;
            case 4 :
                start_time = working_hours.thursday_start;
                end_time = working_hours.thursday_end;
                break;
            case 5 :
                start_time = working_hours.friday_start;
                end_time = working_hours.friday_end;
                break;
            case 6 :
                start_time = working_hours.saturday_start;
                end_time = working_hours.saturday_end;
                break;
        }
        start_time = validateTime(start_time);
        end_time = validateTime(end_time);
        var start_tm_in_min = start_time.split(':')[1] ? parseInt(start_time.split(':')[0] * 60, 10) + parseInt(start_time.split(':')[1], 10) : start_time * 60,
            end_tm_in_min = end_time.split(':')[1] ? parseInt(end_time.split(':')[0] * 60, 10) + parseInt(end_time.split(':')[1], 10) : end_time * 60,
            client_tm_in_min = parseInt(agent_side_date_of_client.getHours() * 60, 10) + parseInt(agent_side_date_of_client.getMinutes(), 10);

        if (client_tm_in_min > start_tm_in_min && client_tm_in_min < end_tm_in_min) {
            return true;
        }

        return false;
    }

    function validateTime(time){
        var hr = time.split(':')[0],
            min = time.split(':')[1]? time.split(':')[1] : 0;
        if(parseInt(min, 10) > 59){
            min = 59;
        }
        else if(parseInt(min, 10) < 0){
            min = 0;
        }

        if(parseInt(hr, 10) >= 24){
            hr = 23;
            min = 59;
        }
        else if(parseInt(hr, 10) < 0){
            hr = 0;
            min = 0;
        }
        return (parseInt(min, 10) === '0' ? hr : (hr + ':' + min));
    } */

    /* UNCOMMENT IF REQUIRED */
    /*This is a demo of custom store copy over to psp domain*/
    /* function sampleFunctionToSetCustomDataInStoreNUpdatePSPDomain()  {
        var storeManager = iframeContentWindow.SN.StoreManager;
        storeManager.setValueInStore("sn.c1", "key2", "value2");
        storeManager.sendDataToXD("sn.c1");
    } */

    customInitialization();

    /* START - QuickStart Package Configs */
    function isOfficeTime() {return true;}
    function stateChange() {}
    function decline() {}
    function minimize() {}
    function ignore() {}
    function shown() {}
    function accept() {}

    function overrideCfConfig(type, config) {
        /* UNCOMMENT IF REQUIRED */
        /* if (type=='init_desktop') {
            //Override desktop chat initialization config
        } else if (type=='start_desktop') {
            //Override desktop chat start config
        } else if (type=='mobile') {
            //Override mobile chat load config
        } */
        return config;
    }

    function inviteConfig() {
        var Conf = SN.Conf
            ,UserAgentParser = SN.UserAgentParser
            ,appPath = Conf.CDN_DOMAIN + Conf.CONST_PSP_KEY + '/' + Conf.CONST_PSP_VERSION + '/'+ Conf.CONST_CDN_VERSION + "/apps/"
        ;

        return {
            "appId": "DEFENCEBANK_APP_01",
            "pageType": (function() {
                if (parent && parent.s && parent.s.pageName && typeof parent.s.pageName === 'string') {
                    return parent.s.pageName;
                }
                return "";
            }),
            "dcfType": "fallback",
            "snHtmlPath": "/psp247/247SN.html",
            "buttonManager": {
                "defaultConfig": {
                    "containerQuery": undefined,
                    "queue": undefined,
                    "excludeEnableAll": false,
                    "enabledOnDevices": "DTM",
                    "replaceContainer": false,
                    "altMessage": {
                        "available": "Click to chat",
                        "busy": "Our agents are busy at the moment",
                        "offline": "Our agents are offline right now",
                        "chatting": "Chat is going on, please switch to chat window",
                        "loading": "Checking status"
                    },
                    "actions": {
                        "accept": accept,
                        "shown": shown,
                        "isOfficeTime": isOfficeTime,
                        "stateChange": stateChange
                    },
                    "styles": {
                        "container": {
                        },
                        "button": {
                            "border": "none",
                            "backgroundColor": "transparent",
                            "outline": "none",
                            "fontSize": "0px",
                            "textIndent": "-9999px"
                        },
                        "available": {
                            "cursor": "pointer"
                        },
                        "loading": {
                            "cursor": "default"
                        },
                        "busy": {
                            "cursor": "default"
                        },
                        "offline": {
                            "cursor": "default"
                        },
                        "chatting": {
                            "cursor": "default"
                        }
                    }
                },
                "buttonList": {
                    "mvp_button": {
                        "containerQuery": "body",
                        "queue": Conf.CONST_ASSIST_DEFQUEUE,
                        "altMessage": {
                            "available": "Click me",
                            "busy": "Offline",
                            "offline": "Offline",
                            "chatting": "Offline",
                            "loading": "Offline"
                        },
                        "styles": {
                            "container": {
                                //Optional
                            },
                            "button": {
                                //Optional
                                "position": "fixed",
                                "bottom": "0px",
                                "right": "0px",
                                //Required
                                "width": "192px",
                                "height": "38px",
                                "backgroundImage": "url('//"+appPath+"invite/img/button.png')",
                                //Enforced
                                "border": "none",
                                "backgroundColor": "transparent",
                                "outline": "none",
                                "fontSize": "0px",
                                "textIndent": "-9999px",
                                "zIndex": "999999"
                            },
                            "available": {
                                //Optional
                                "display": "block",
                                //Required
                                "backgroundPosition": "0 0px",
                                //Enforced
                                "cursor": "pointer"
                            },
                            "loading": {
                                //Optional
                                "display": "none",
                                //Required
                                "backgroundPosition": "0 0px",
                                //Enforced
                                "cursor": "default"
                            },
                            "busy": {
                                //Optional
                                "display": "none",
                                //Required
                                "backgroundPosition": "0 0px",
                                //Enforced
                                "cursor": "default"
                            },
                            "offline": {
                                //Optional
                                "display": "none",
                                //Required
                                "backgroundPosition": "0 0px",
                                //Enforced
                                "cursor": "default"
                            },
                            "chatting": {
                                //Optional
                                "display": "none",
                                //Required
                                "backgroundPosition": "0 0px",
                                //Enforced
                                "cursor": "default"
                            }
                        }
                    }
                }
            },
            "proactiveManager": {
                "defaultConfig": {
                    "queue": undefined,
                    "ignoreTimeout": undefined,
                    "afterMinimize": undefined,
                    "isDraggable": true,
                    "htmls": undefined,
                    "altMessage": {
                        "accept": "Click to chat",
                        "decline": "No, ask me later",
                        "minimize": "Dock the invite"
                    },
                    "actions": {
                        "shown": shown,
                        "accept": accept,
                        "decline": decline,
                        "minimize": minimize,
                        "ignore": ignore
                    },
                    "styles": {
                        "container": {
                            "position": "fixed",
                            "webkitUserSelect": "none", /* Chrome/Safari */
                            "mozUserSelect": "none", /* Firefox */
                            "msUserSelect": "none", /* IE10+ */
                            "userSelect": "none"
                        },
                        "content": {
                        },
                        "controls": {
                            "position": "absolute",
                            "top": "0px",
                            "cursor": "move"
                        },
                        "accept": {
                            "position": "absolute",
                            "backgroundColor": "transparent",
                            "cursor": "pointer",
                            "border": "none",
                            "outline": "none",
                            "fontSize": "0px",
                            "textIndent": "-9999px"
                        },
                        "decline": {
                            "position": "absolute",
                            "backgroundColor": "transparent",
                            "cursor": "pointer",
                            "border": "none",
                            "outline": "none",
                            "fontSize": "0px",
                            "textIndent": "-9999px"
                        },
                        "minimize": {
                            "position": "absolute",
                            "backgroundColor": "transparent",
                            "cursor": "pointer",
                            "border": "none",
                            "outline": "none",
                            "fontSize": "0px",
                            "textIndent": "-9999px"
                        }
                    }
                },
                "proactiveList": {
                    "mvp_proactive":{
                        "queue": Conf.CONST_ASSIST_DEFQUEUE,
                        "ignoreTimeout": 60,
                        "altMessage": {
                            "accept": "Click to chat",
                            "decline": "No, ask me later",
                            "minimize": "Dock the invite"
                        },
                        "styles": {
                            "container": {
                                "position": "fixed",
                                "top": "125px",
                                "right": "125px",
                                "width": "478px",
                                "height": "226px",
                                "webkitUserSelect": "none", /* Chrome/Safari */
                                "mozUserSelect": "none", /* Firefox */
                                "msUserSelect": "none", /* IE10+ */
                                "userSelect": "none",
                                "zIndex": "999999"
                            },
                            "content": {
                                "backgroundImage": "url('//"+appPath+"invite/img/proactive.png')",
                                "width": "478px",
                                "height": "226px"
                            },
                            "controls": {
                                "width": "478px",
                                "height": "226px",
                                "position": "absolute",
                                "top": "0px",
                                "cursor": "move"
                            },
                            "accept": {
                                "position": "absolute",
                                "width": "192px",
                                "height": "38px",
                                "backgroundColor": "transparent",
                                "left": "271px",
                                "top": "171px",
                                "cursor": "pointer",
                                "border": "none",
                                "outline": "none",
                                "fontSize": "0px",
                                "textIndent": "-9999px"
                            },
                            "decline": {
                                "position": "absolute",
                                "width": "",
                                "height": "18px",
                                "backgroundColor": "transparent",
                                "top": "14px",
                                "left": "443px",
                                "cursor": "pointer",
                                "border": "none",
                                "outline": "none",
                                "fontSize": "0px",
                                "textIndent": "-9999px"
                            },
                            "minimize": {
                                "position": "absolute",
                                "width": "0px",
                                "height": "0px",
                                "backgroundColor": "transparent",
                                "top": "0px",
                                "left": "0px",
                                "cursor": "pointer",
                                "border": "none",
                                "outline": "none",
                                "fontSize": "0px",
                                "textIndent": "-9999px"
                            }
                        }
                    }
                }
            },
            "assistConfig": {
                "caserver": Conf.CONST_ASSIST_CA_ROOT,
                "defqueue": Conf.CONST_ASSIST_DEFQUEUE,
                "accountId": Conf.CONST_ASSIST_ACCOUNT_ID,
                "vsserver": Conf.CONST_ASSIST_VS_ROOT,
                // For debug purpose, would be undefined otherwise
                "overrideQueue" : Conf.DEBUG_QUEUE,
                "overrideResponse": Conf.DEBUG_RESPONSE
            },
            "prechatContext": {
                "vi" : "SN.SessionManager.getGlobalSession().getVisitorId()"
                ,"asid" : "$activeSessionId()"
                ,"bsid" : "SN.SessionManager.getGlobalSession().getVisitorId()+'-'+$activeSessionId()"
                ,"tpid" : "SN.SessionManager.getGlobalSession().getTargetPopulationId()"
                ,"vg" : "SN.SessionManager.getGlobalSession().getVisitorGroup()"
                ,"appid" : "SN.WOWPx.Helpers.getAppId()"
                ,"psid" : ""//Placeholder for clid
                ,"url" : "parent.document.location.href.slice(0,100)"
                ,"invitePage" : "SN.Tracker.getUniquePageId()"
                ,"sc" : "" //Placeholder for ruleId
                //,"queue": Automatic parameter by Assist (Once integrated as prechat)
                ,"rc" : "" //Placeholder for rc (b or p)
                ,"chatType" : "" //Placeholder for chatType (b or p)
                ,"btnName" : "" //Placeholder for id
                ,"pcs" : "$getTotalVisitCount()"
                ,"ip" : "$geoIPAddress()"
                ,"city" : "$geoCity()"
                ,"country" : "$geoCountry()"
                ,"org" : "$geoOrganization()"
                ,"worldRegion" : "$geoRegion()"
                ,"postCode" : "$geoPostalCode()"
                ,"isp" : "$geoIsp()"
                ,"btnTyp" : "" //Placeholder for id
                //,"os" : Automatic parameter by Assist
                //,"browser" : Automatic parameter by Assist
                //,"tz": Automatic parameter by Assist
                //,"browserVersion": Automatic parameter by Assist
                //,"accountId": Automatic parameter by Assist
                //,"trackingId": Automatic parameter by Assist
            }
        };
    }

    function setDefaultQueue() {
        var Conf = SN.Conf;
        if (Conf.CONST_ASSIST_DEFQUEUE) {
            return;
        }

        if (SN.UserAgentParser.getDeviceType()!=="D") {
            Conf.CONST_ASSIST_DEFQUEUE = "demo-demo-queue-chelliah";
        } else {
            Conf.CONST_ASSIST_DEFQUEUE = "demo-demo-queue-chelliah";
        }
    }

    function processCustomerSurveyData(eventData) {
        function numToStr(num){
            return (num<10)? "0"+num: ""+num;
        }

        try {
            var ces, ans;
            if (eventData.data && eventData.data.f && eventData.data.f.o && eventData.data.f.o.fd) {
                ces = JSON.parse(eventData.data.f.o.fd);

                for (var qu in ces) {
                    if (ces.hasOwnProperty(qu)) {
                        if (/_free_text/.test(qu)) {
                            continue;
                        }
                        ans = parseInt(ces[qu],10);
                        if (!isNaN(ans)) {
                            ces[qu] = "a_s" + numToStr(ans);
                        }
                    }
                }
                eventData.data.f.o.fd = JSON.stringify(ces);
            }
        } catch (e) {
            SN.Utils.error("Error in Customer Survey ->" + e);
        }
    }

    var agentName;
    function trackDesktop(eventData) {
        if (typeof eventData.eventId == "number") {
            eventData.eventId = eventData.eventId.toString();
        }

        switch (eventData.eventId) {
            case "10001":
                eventData.eventId = "10010";
                break;
            case "10011":
                processCustomerSurveyData(eventData);
                break;
            case "10012":
                eventData.data.f.o.ft = "offline form";
                break;
            case "10004":
                agentName = eventData.data.f.a.cs;
                break;
            case "10006":
                eventData.data.f.a.cs = agentName;
                break;
            case "400101":
                eventData.eventId = "10010";
                eventData.data.f.o.ft = "slider";
                break;
            case "400102":
            case "400103":
            case "400104":
            case "705000":
            case "705001":
            case "705002":
            case "705003":
            case "705004":
            case "705005":
            case "705006":
            case "705007":
            case "705008":
            case "705009":
            case "705010":
            case "705011":
            case "705012":
            case "705015":
            case "705016":
            case "705017":
            case "705018":
                return;
            default:
                break;
        }

        return eventData;
    }

    function track(medium, eventData) {
        var data;

        if (medium=='desktop') {
            data = trackDesktop(eventData);
        } else {
            /* Handle other mediums, if necessary */
        }

        if (data) {
            iframeContentWindow.SN.EventManager.fire("WOWPXAPP_EVENT", data);
        }
    }

    /* UNCOMMENT IF REQUIRED */
    /* iframeContentWindow.SN.WOWPx.TfsSendDataApi.setCustomTypeHandler(function(){
        //Handle custom _tfsq types here
    }); */

    function init() {
        setDefaultQueue();

        iframeContentWindow.SN.EventManager.observe(SN_CONSTANTS.BOOTSTRAP_COMPLETED_EVENT, function(){
            var config = inviteConfig();
            iframeContentWindow.SN.WOWPx.InitInvite.init(config);
            /*
            Call this if ADP's FAQ, Info, CTA, Insights need to be invoked
            chatUtilUrl need to be passed to the fucntion
            */
            // iframeContentWindow.SN.ADP.VEA.Initialize({
            //     "chatUtilUrl" : "//d1af033869koo7.cloudfront.net/dcf/v2/chat-util.min.js"
            // });

        });
    }
   // init();

    /* END - QuickStart Package Configs */

    /*START - ADP's Client Specific functions*/
    /*

    // @accepts targetIdentifier, runCallDataParams respectively
    // @returns json object of key, value pairs with will be added in CHAT_CUSTOM_PARAMS

    function ADP_getClientSpecificChatCustomParams(targetIdentifier, runCallDataParams, appType) {
        var temp = {
            "key1" : "value1"
        };

        // Add app specific custom params under the switch case
        switch(appType) {
            case "FAQ":
                // temp["faqkey1"] = "faqvalue1";
                break;
            case "Info":
                // temp["infokey1"] = "infovalue1";
                break;
            case "CTA":
                // temp["ctakey1"] = "ctavalue1";
                break;
            case "Insights":
                // temp["insightskey1"] = "insightsvalue1";
                break;
            case "Invite":
                // temp["inviteskey1"] = "invitevalue1";
                break;
        }
        return temp;
    }

    // @accepts data received in onContextUpdate of by247.chat.init used in ADP
    // @returns nothing
    function ADP_clientSpecificOnContextUpdate(data) {

    }

    // @return vsserver complete url
    function ADP_getVsServer() {
        return SN.Conf.CONST_ASSIST_VS_ROOT;
    }

    // @return caserver complete url
    function ADP_getCaServer() {
        return SN.Conf.CONST_ASSIST_CA_ROOT;
    }

    // @return account id
    function ADP_getAccountId() {
        return SN.Conf.CONST_ASSIST_ACCOUNT_ID;
    }

    // @return queue
    function ADP_getQueue() {
        return SN.Conf.CONST_ASSIST_DEFQUEUE;
    }

    // Override the client specific object to add or remove the variables
    // required for events. (pxt calls)
    function ADP_getClientSpecificCustomObject(_object){
        return _object;
    }

    // Invite App functions
    function ADP_getClientSpecificCustomInviteAppCssUrl() {
        return "";
    }

    function ADP_getClientSpecificInviteAppConfig() {
        return { // config to be added newly
            "popup": {
                "caType": "ONLY_ONCE", //can be of type ONLY_ONCE, REPEAT or ONLY_IF_TRUE
                "container": "body", //element which u want to append the invite to
                "queue": "", //queue for the invite
                "ignoreTimeout": 60, //  timeout for invites, in seconds . -1 for no timeout
                "states": {
                    "available": {
                        "template": "inviteApp", // the template u want to implement for the invite
                        "data": {
                            "id": "popup",
                            "html": "",
                            "loadedFunc": function() {}, // callback that will be executed when the invite is loaded
                            "unloadedFunc": function() {} // callback that will be executed when the invite is unloaded}
                        }
                    },
                    "busy": {
                        "template": "inviteAppBusy", // the template u want to implement for the invite
                        "data": {
                            "id": "popup",
                            "html": "",
                            "loadedFunc": function() {}, // callback that will be executed when the invite is loaded
                            "unloadedFunc": function() {} // callback that will be executed when the invite is unloaded}
                        }
                    },
                    "chatting": {
                        "template": "inviteAppChatting", // the template u want to implement for the invite
                        "data": {
                            "id": "popup",
                            "html": "",
                            "loadedFunc": function() {}, // callback that will be executed when the invite is loaded
                            "unloadedFunc": function() {} // callback that will be executed when the invite is unloaded}
                        }
                    },
                    "offline": {
                        "template": "inviteAppOffline", // the template u want to implement for the invite
                        "data": {
                            "id": "popup",
                            "html": "",
                            "loadedFunc": function() {}, // callback that will be executed when the invite is loaded
                            "unloadedFunc": function() {} // callback that will be executed when the invite is unloaded}
                        }
                    }
                }
            },
            "docked": {
                "caType": "ONLY_ONCE", //can be of type ONLY_ONCE, REPEAT or ONLY_IF_TRUE
                "container": "body", //element which u want to append the invite to
                "queue": "", //queue for the invite
                "ignoreTimeout": -1, //  timeout for invites, in seconds . -1 for no timeout
                "states": {
                    "available": {
                        "template": "inviteApp", // the template u want to implement for the invite
                        "data": {
                            "id": "docked",
                            "html": "",
                            "loadedFunc": function() {}, // callback that will be executed when the invite is loaded
                            "unloadedFunc": function() {} // callback that will be executed when the invite is unloaded}
                        }
                    },
                    "busy": {
                        "template": "inviteAppBusy", // the template u want to implement for the invite
                        "data": {
                            "id": "docked",
                            "html": "",
                            "loadedFunc": function() {}, // callback that will be executed when the invite is loaded
                            "unloadedFunc": function() {} // callback that will be executed when the invite is unloaded}
                        }
                    },
                    "chatting": {
                        "template": "inviteAppChatting", // the template u want to implement for the invite
                        "data": {
                            "id": "docked",
                            "html": "",
                            "loadedFunc": function() {}, // callback that will be executed when the invite is loaded
                            "unloadedFunc": function() {} // callback that will be executed when the invite is unloaded}
                        }
                    },
                    "offline": {
                        "template": "inviteAppOffline", // the template u want to implement for the invite
                        "data": {
                            "id": "docked",
                            "html": "",
                            "loadedFunc": function() {}, // callback that will be executed when the invite is loaded
                            "unloadedFunc": function() {} // callback that will be executed when the invite is unloaded}
                        }
                    }
                }
            },
            "myAppList": ['popup', 'docked'] // an array of appIds can be sent to trigger multiple apps for single rule
        };
    }

    function ADP_getClientSpecificInviteAppAssistConfig() {
        return { //config to be added newly
            "caserver": Conf.CONST_ASSIST_CA_ROOT //required
            ,"defqueue": Conf.CONST_ASSIST_DEFQUEUE //required
            ,"accountId": Conf.CONST_ASSIST_ACCOUNT_ID //required
            ,"vsserver": Conf.CONST_ASSIST_VS_ROOT //required
            ,"isOfficeTime": "" // used to evaluate states for the invites. If caStatus is false and this function returns true, then the state of the invite is "busy", else it is "offline".  In case of absence of this function, the state is always "busy" in case of caStatus false.
            ,"avqueue": "" // required to be sent in case of absence of defqueue
            ,"repeatTill": "" // optional: in minutes. The time until which the ca server calls should be made.2 mins is default
            ,"resThreshold": "" // optional
            ,"reqThreshold": "" //optional
        };
    }
    */
    /*END - ADP's Client Specific functions*/

    /*function to trigger events for personalisation*/
    //function fireVisitorEvent(){
         //if (parent.SN.personalization){
            iframeContentWindow.SN.EventManager.observe("VISITOR_EVENT", function(){
                if (parent.SN.personalization) {
                    parent.SN.personalization.makeGetSegmentCall();
                }
            });
            iframeContentWindow.SN.EventManager.observe(SN_CONSTANTS.PAGE_LOAD_EVENT_COMPLETE, function(){
                if(location.pathname === "/get-in-touch" && document.referrer !== ''){
                    switch(document.referrer.replace(/^[^:]+:\/\/[^/]+/, '').replace(/#.*/, '')){
                        case "/car-loans":
                        case "/homeloanpackage":
                        case "/creditcard":
                        case "/dhoas-home-loan":
                             var key = 'Lead';
                             firePixel (key)
                            break;
                        default:
                            break;
                    }
                } else if(location.pathname === "/thank-you" && document.referrer !== ''){
                    if(document.referrer.replace(/^[^:]+:\/\/[^/]+/, '').replace(/#.*/, '') == '/get-in-touch'){
                        var key = 'Purchase';
                        firePixel (key)
                    }
                }
                
            });
        //}
   // }


    var me = {
        /* ADP Related functions. Uncomment if required */
        /*
        ADP_getClientSpecificChatCustomParams : ADP_getClientSpecificChatCustomParams,
        ADP_clientSpecificOnContextUpdate : ADP_clientSpecificOnContextUpdate,
        ADP_getVsServer : ADP_getVsServer,
        ADP_getCaServer : ADP_getCaServer,
        ADP_getAccountId : ADP_getAccountId,
        ADP_getQueue : ADP_getQueue,
        ADP_getClientSpecificCustomObject : ADP_getClientSpecificCustomObject,
        ADP_getClientSpecificInviteAppConfig : ADP_getClientSpecificInviteAppConfig,
        ADP_getClientSpecificInviteAppAssistConfig : ADP_getClientSpecificInviteAppAssistConfig,
        ADP_getClientSpecificCustomInviteAppCssUrl : ADP_getClientSpecificCustomInviteAppCssUrl,
        */
        renderInitcall : renderInitcall,
        getEncodedValue : getEncodedValue,
        getDecodedValue : getDecodedValue,
        overrideCfConfig : overrideCfConfig,
        track : track
    };
    return me;
};

function firePixel (key){
    if(typeof ecTrack == "function"){
        ecTrack('track',key,{});
    }
    (function() { 
        var axel = Math.random() + "";
        var a = axel * 10000000000000;
        $('<iframe src="https://4250979.fls.doubleclick.net/activityi;src=4250979;type=invmedia;cat=o19okxch;u1=56e2e896-4492-44a9-91e1-a0d995d2daa9;u2=Conversion;u3=;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;ord=' + a + '?" width="1" height="1" frameborder="0" style="display:none"></iframe>').appendTo('body');
    }());
}
/*
 Any global custom functions should be added to the below.
 */

SN.CallBackToCustom = (function() {
    /**
     * Call back to Custom code to indicate that we are about to create sn_iframe.
     */
    function onSNIframeToBeCreated() {

    }

    /**
     * the param ENSDetails will contain all information about the useragent as well as which the cause of ENS
     * @param ENSDetails
     */
    function onEnvironmentNotSupported(ENSDetails) {

    }

    function onTfsDataPush(tfsArray) {
        var key = 'Lead';

        if (tfsArray && tfsArray.constructor === Array) { // Check if array
            for (i = 0; i < tfsArray.length; i++) { 
                if(tfsArray[i] && typeof(tfsArray[i].u_key) != 'undefined') {
                    key = tfsArray[i].u_key; 
                    break;
                }
            }
        }

        switch(location.pathname){
            case "/car-loans":
                key = (key == 'DHOAS_HOMELOAN_APPLY_NOW' || key == 'CARLOAN_APPLY_NOW')?'Purchase':key;
                firePixel (key);
                break;
            case "/homeloanpackage":
            case "/creditcard":
                key = (key == 'CREDIT_CARD_APPLY_NOW')?'Purchase':key;
                firePixel (key);
                break;
            case "/dhoas-home-loan":
                key = (key == 'DHOAS_HOMELOAN_APPLY_NOW')?'Purchase':key;
                firePixel (key);
                break;
            case "/termdeposit":
            case "/insurance/travel": 
            case "/car-loans":
            case "/insurance/car":
            case "/insurance":
            case "/insurance/home-and-contents":
                key = "Lead";
                firePixel (key);
                break;
                
            default:
                break;
        }
        
    }


    return {
        onSNIframeToBeCreated: onSNIframeToBeCreated,
        onEnvironmentNotSupported: onEnvironmentNotSupported,
        onTfsDataPush: onTfsDataPush
    }

})();

SN._tfscFunctions = (function() {


    function $getNavPath() {
        return "";
    }

    function $getQueue() {
        return SN.Conf.CONST_ASSIST_DEFQUEUE;
    }

    /**
     * function to determine page id expression
     */
    function getPageIdExpression() {
        /*  if(location.pathname == "/testpages/wowpx_invitation.html"
         || location.pathname == "/psp247/247action.html"
         || location.pathname == "/testsites/wowpx_newwindow.html"){
         return "wowpx_test_tagged_page";
         }*/
        return "tagged_page";

    }

    /**
     * function to determine web tracker id expression
     */
    function getWebTrackIdExpression() {
        return "wti";
    }

    var me = {
        getPageIdExpression : getPageIdExpression,
        getWebTrackIdExpression : getWebTrackIdExpression,
        $getNavPath : $getNavPath,
        $getQueue :$getQueue
    };
    return me;
})();

// function to load 247 px _platform

function load247px()    {
    var psp = document.createElement("script");
    psp.type = "text/javascript";
    psp.async = true;
    psp.src = document.location.protocol + '//' + SN.Conf.cdnRoot + "/psp/platform/" + SN.Conf.CONST_PSP_VERSION + "/247loader.js";

    var a = document.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(psp,a);

}

load247px();

(function() {
    var scriptEle = document.createElement("script");
    scriptEle.type = "text/javascript";
    scriptEle.async = true;
    scriptEle.id = "db_cookiesync";
    scriptEle.src = "//turbo.engageclick.com/client/cookiesync/cookieSyncAdapter.js";
    var attachScript = document.getElementsByTagName("script")[0];
    attachScript.parentNode.insertBefore(scriptEle,attachScript);
}());

function read_cookie(k,r){return(r=RegExp('(^|; )'+encodeURIComponent(k)+'=([^;]*)').exec(document.cookie))?r[2]:null;}
function loadPersonalize()    {
    var psp = document.createElement("script");
    psp.type = "text/javascript";
    psp.async = true;
    var personaliseCookie = read_cookie("sn.pzpath");
    if(personaliseCookie == "poc"){
        psp.src = document.location.protocol + '//' + SN.Conf.cdnRoot + "/psp/" + SN.Conf.CONST_PSP_KEY + "/personalize.js";
    }else{
        psp.src = document.location.protocol + '//' + SN.Conf.cdnRoot + "/psp/" + SN.Conf.CONST_PSP_KEY + "/default/"+ SN.Conf.CONST_CDN_VERSION +"/personalization/js/personalize.js";   
    }

    var a = document.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(psp,a);

}

loadPersonalize(); 