// == Configuration
// config.js is where you will find the core Grafana configuration. This file contains parameter that
// must be set before Grafana is run for the first time.
define(['settings'],
function (Settings) {

  return new Settings({

    // datasources, you can add multiple
    datasources: {
      elasticsearch: {
        grafanaDB: true,
        index: 'grafana-dash',
        type: 'elasticsearch',
        url: 'http://dashboard.ops.turn.com/search',
      },
      graphite: {
        type: 'graphite',
        url: 'http://ops016.sjc2.turn.com:80',
      },
      opentsdb: {
        default: true,
        type: 'opentsdb',
        url: 'http://dwh-edge003.atl1.turn.com:4245',
      },
      opentsdbM: {
        type: 'opentsdbM',
        url: 'http://dwh-edge003.atl1.turn.com:4245',
      },
    },

    /* Global configuration options
    * ========================================================
    */

    // specify the limit for dashboard search results
    search: {
      max_results: 20
    },

    // default start dashboard
    default_route: '/dashboard/file/default.json',

    // set to false to disable unsaved changes warning
    unsaved_changes_warning: true,

    // set the default timespan for the playlist feature
    // Example: "1m", "1h"
    playlist_timespan: "1m",

    // If you want to specify password before saving, please specify it bellow
    // The purpose of this password is not security, but to stop some users from accidentally changing dashboards
    admin: {
      password: ''
    },

    // Change window title prefix from 'Grafana - <dashboard title>'
    window_title_prefix: 'Grafana - ',

    // Add your own custom panels
    plugins: {
      // list of plugin panels
      panels: [],
      // requirejs modules in plugins folder that should be loaded
      // for example custom datasources
      dependencies: [],
    }

  });
});
