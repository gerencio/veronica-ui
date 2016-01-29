(function() {
    'use strict';

    var mesosServices = angular.module('mesos.services', []);


    mesosServices.service('$alert', ['$rootScope', function($rootScope) {
        // Types taken from Bootstraps v3's "Alerts"[1] so the type can be used
        // as the class name.
        //
        // [1] http://getbootstrap.com/components/#alerts
        var TYPE_DANGER = 'danger';
        var TYPE_INFO = 'info';
        var TYPE_SUCCESS = 'success';
        var TYPE_WARNING = 'warning';

        var nextId = 1;

        var nextAlerts = [];
        var currentAlerts = $rootScope.currentAlerts = [];

        // Creates an alert to be rendered on the next page view.
        //
        // messageOrOptions - Either a String or an Object that will be used to
        //   render an alert on the next view. If a String, it will be the
        //   message in the alert. If an Object, "title" will be bolded, "message"
        //   will be normal font weight, and "bullets" will be rendered as a list.
        function alert(type, messageOrOptions) {
            var alertObject;

            if (angular.isObject(messageOrOptions)) {
                alertObject = angular.copy(messageOrOptions);
                alertObject.type = type;
            } else {
                alertObject = {
                    message: messageOrOptions,
                    type: type
                };
            }

            alertObject.id = nextId;
            nextId += 1;
            return nextAlerts.push(alertObject);
        }

        this.danger = function(messageOrOptions) {
            return alert(TYPE_DANGER, messageOrOptions);
        };
        this.info = function(messageOrOptions) {
            return alert(TYPE_INFO, messageOrOptions);
        };
        this.success = function(messageOrOptions) {
            return alert(TYPE_SUCCESS, messageOrOptions);
        };
        this.warning = function(messageOrOptions) {
            return alert(TYPE_WARNING, messageOrOptions);
        };

        // Rotate alerts each time the user navigates.
        $rootScope.$on('$locationChangeSuccess', function() {
            if (nextAlerts.length > 0) {
                // If there are alerts to be shown next, they become the current alerts.
                currentAlerts = $rootScope.currentAlerts = nextAlerts;
                nextAlerts = [];
            } else if (currentAlerts.length > 0) {
                // If there are no next alerts, the current alerts still need to expire
                // if there are any so they won't display again.
                currentAlerts = $rootScope.currentAlerts = [];
            }
        });
    }]);


    function Misc(){}

    Misc.prototype.hasSelectedText = function hasSelectedText() {
        if (window.getSelection) {  // All browsers except IE before version 9.
            var range = window.getSelection();
            return range.toString().length > 0;
        }
        return false;
    };
    // Invokes the pailer for the specified host and path using the
    // specified window_title.
    Misc.prototype.pailer = function pailer(host, path, window_title) {
        var url = '//' + host + '/files/read.json?path=' + path;
        var pailer =
            window.open('/views/pages/mesos/pailer.html', url, 'width=580px, height=700px');

        // Need to use window.onload instead of document.ready to make
        // sure the title doesn't get overwritten.
        pailer.onload = function() {
            // pailer.document.title = window_title + ' (' + host + ')';
            //console.log(window_title);
        };
    };
    Misc.prototype.updateInterval = function updateInterval(num_slaves) {
        // TODO(bmahler): Increasing the update interval for large clusters
        // is done purely to mitigate webui performance issues. Ideally we can
        // keep a consistently fast rate for updating statistical information.
        // For the full system state updates, it may make sense to break
        // it up using pagination and/or splitting the endpoint.
        if (num_slaves < 500) {
            return 10000;
        } else if (num_slaves < 1000) {
            return 20000;
        } else if (num_slaves < 5000) {
            return 60000;
        } else if (num_slaves < 10000) {
            return 120000;
        } else if (num_slaves < 15000) {
            return 240000;
        } else if (num_slaves < 20000) {
            return 480000;
        } else {
            return 960000;
        }
    };
    Misc.prototype.update = function update($scope, $timeout, data) {
        // Don't do anything if the data hasn't changed.
        if ($scope.data === data) {
            return true; // Continue polling.
        }

        $scope.state = JSON.parse(data);

        // Determine if there is a leader (and redirect if not the leader).
        if ($scope.state.leader) {

            // Redirect if we aren't the leader.
            if ($scope.state.leader !== $scope.state.pid) {
                $scope.redirect = 6000;
                $("#not-leader-alert").removeClass("hide");

                var countdown = function() {
                    if ($scope.redirect === 0) {
                        // TODO(benh): Use '$window'.
                        window.location = '/mesos/master/redirect';
                    } else {
                        $scope.redirect = $scope.redirect - 1000;
                        $timeout(countdown, 1000);
                    }
                };
                countdown();
                return false; // Don't continue polling.
            }
        }

        // A cluster is named if the state returns a non-empty string name.
        // Track whether this cluster is named in a Boolean for display purposes.
        $scope.clusterNamed = !!$scope.state.cluster;

        // Check for selected text, and allow up to 20 seconds to pass before
        // potentially wiping the user highlighted text.
        // TODO(bmahler): This is to avoid the annoying loss of highlighting when
        // the tables update. Once we can have tighter granularity control on the
        // angular.js dynamic table updates, we should remove this hack.
        $scope.time_since_update += $scope.delay;

        if (this.hasSelectedText() && $scope.time_since_update < 20000) {
            return true;
        }

        $scope.data = data;

        // Pass this pollTime to all relativeDate calls to make them all relative to
        // the same moment in time.
        //
        // If relativeDate is called without a reference time, it instantiates a new
        // Date to be the reference. Since there can be hundreds of dates on a given
        // page, they would all be relative to slightly different moments in time.
        $scope.pollTime = new Date();

        // Update the maps.
        $scope.slaves = {};
        $scope.frameworks = {};
        $scope.offers = {};
        $scope.completed_frameworks = {};
        $scope.active_tasks = [];
        $scope.completed_tasks = [];

        // Update the stats.
        $scope.cluster = $scope.state.cluster;
        $scope.total_cpus = 0;
        $scope.total_mem = 0;
        $scope.used_cpus = 0;
        $scope.used_mem = 0;
        $scope.offered_cpus = 0;
        $scope.offered_mem = 0;

        $scope.staged_tasks = $scope.state.staged_tasks;
        $scope.started_tasks = $scope.state.started_tasks;
        $scope.finished_tasks = $scope.state.finished_tasks;
        $scope.killed_tasks = $scope.state.killed_tasks;
        $scope.failed_tasks = $scope.state.failed_tasks;
        $scope.lost_tasks = $scope.state.lost_tasks;

        $scope.activated_slaves = $scope.state.activated_slaves;
        $scope.deactivated_slaves = $scope.state.deactivated_slaves;

        _.each($scope.state.slaves, function(slave) {
            $scope.slaves[slave.id] = slave;
            $scope.total_cpus += slave.resources.cpus;
            $scope.total_mem += slave.resources.mem;
        });

        var setTaskMetadata = function(task) {
            if (!task.executor_id) {
                task.executor_id = task.id;
            }
            if (task.statuses.length > 0) {
                task.start_time = task.statuses[0].timestamp * 1000;
                task.finish_time =
                    task.statuses[task.statuses.length - 1].timestamp * 1000;
            }
        };

        _.each($scope.state.frameworks, function(framework) {
            $scope.frameworks[framework.id] = framework;

            _.each(framework.offers, function(offer) {
                $scope.offers[offer.id] = offer;
                $scope.offered_cpus += offer.resources.cpus;
                $scope.offered_mem += offer.resources.mem;
                offer.framework_name = $scope.frameworks[offer.framework_id].name;
                offer.hostname = $scope.slaves[offer.slave_id].hostname;
            });

            $scope.used_cpus += framework.resources.cpus;
            $scope.used_mem += framework.resources.mem;

            framework.cpus_share = 0;
            if ($scope.total_cpus > 0) {
                framework.cpus_share = framework.resources.cpus / $scope.total_cpus;
            }

            framework.mem_share = 0;
            if ($scope.total_mem > 0) {
                framework.mem_share = framework.resources.mem / $scope.total_mem;
            }

            framework.max_share = Math.max(framework.cpus_share, framework.mem_share);

            // If the executor ID is empty, this is a command executor with an
            // internal executor ID generated from the task ID.
            // TODO(brenden): Remove this once
            // https://issues.apache.org/jira/browse/MESOS-527 is fixed.
            _.each(framework.tasks, setTaskMetadata);
            _.each(framework.completed_tasks, setTaskMetadata);

            $scope.active_tasks = $scope.active_tasks.concat(framework.tasks);
            $scope.completed_tasks =
                $scope.completed_tasks.concat(framework.completed_tasks);
        });

        _.each($scope.state.completed_frameworks, function(framework) {
            $scope.completed_frameworks[framework.id] = framework;

            _.each(framework.completed_tasks, setTaskMetadata);
        });

        $scope.used_cpus -= $scope.offered_cpus;
        $scope.used_mem -= $scope.offered_mem;

        $scope.idle_cpus = $scope.total_cpus - ($scope.offered_cpus + $scope.used_cpus);
        $scope.idle_mem = $scope.total_mem - ($scope.offered_mem + $scope.used_mem);

        $scope.time_since_update = 0;
        $scope.$broadcast('state_updated');

        return true; // Continue polling.
    };

    mesosServices.service('$misc', [Misc]);




    var uiModalDialog = angular.module('ui.bootstrap.dialog', ['ui.bootstrap']);
    uiModalDialog
        .factory('$dialog', ['$rootScope', '$modal', function ($rootScope, $modal) {

            var prompt = function(title, message, buttons) {

                if (typeof buttons === 'undefined') {
                    buttons = [
                        {result:'cancel', label: 'Cancel'},
                        {result:'yes', label: 'Yes', cssClass: 'btn-primary'}
                    ];
                }

                var ModalCtrl = function($scope, $modalInstance) {
                    $scope.title = title;
                    $scope.message = message;
                    $scope.buttons = buttons;
                };

                return $modal.open({
                    templateUrl: 'template/dialog/message.html',
                    controller: ModalCtrl
                }).result;
            };

            return {
                prompt: prompt,
                messageBox: function(title, message, buttons) {
                    return {
                        open: function() {
                            return prompt(title, message, buttons);
                        }
                    };
                }
            };
        }]);

    function Statistics() {
        this.cpus_user_time_secs = 0.0;
        this.cpus_user_usage = 0.0;
        this.cpus_system_time_secs = 0.0;
        this.cpus_system_usage = 0.0;
        this.cpus_limit = 0.0;
        this.cpus_total_usage = 0.0;
        this.mem_rss_bytes = 0.0;
        this.mem_limit_bytes = 0.0;
    }

    Statistics.prototype.add = function(statistics) {
        this.cpus_user_time_secs += statistics.cpus_user_time_secs;
        this.cpus_system_time_secs += statistics.cpus_system_time_secs;
        this.cpus_total_usage += statistics.cpus_total_usage;
        this.cpus_limit += statistics.cpus_limit;
        this.mem_rss_bytes += statistics.mem_rss_bytes;
        this.mem_limit_bytes += statistics.mem_limit_bytes;

        // Set instead of add the timestamp since this is an instantaneous view of
        // CPU usage since the last poll.
        this.timestamp = statistics.timestamp;
    };

    Statistics.prototype.diffUsage = function(statistics) {
        this.cpus_user_usage =
            (this.cpus_user_time_secs - statistics.cpus_user_time_secs) /
            (this.timestamp - statistics.timestamp);
        this.cpus_system_usage =
            (this.cpus_system_time_secs - statistics.cpus_system_time_secs) /
            (this.timestamp - statistics.timestamp);
        this.cpus_total_usage = this.cpus_user_usage + this.cpus_system_usage;
    };

    Statistics.parseJSON = function(json) {
        var statistics = new Statistics();
        statistics.add(json);
        return statistics;
    };

    // Top is an abstraction for polling a slave's monitoring endpoint to
    // periodically update the monitoring data. It also computes CPU usage.
    // This places the following data in scope.monitor:
    //
    //   $scope.monitor = {
    //     "statistics": <stats>,
    //     "frameworks": {
    //       <framework_id>: {
    //         "statistics": <stats>,
    //         "executors": {
    //           <executor_id>: {
    //             "executor_id": <executor_id>,
    //             "framework_id": <framework_id>,
    //             "executor_name: <executor_name>,
    //             "source": <source>,
    //             "statistics": <stats>,
    //           }
    //         }
    //       }
    //     }
    //    }
    //
    // To obtain slave statistics:
    //   $scope.monitor.statistics
    //
    // To obtain a framework's statistics:
    //   $scope.monitor.frameworks[<framework_id>].statistics
    //
    // To obtain an executor's statistics:
    //   $scope.monitor.frameworks[<framework_id>].executors[<executor_id>].statistics
    //
    // In the above,  <stats> is the following object:
    //
    //   {
    //     cpus_user_time_secs: value,
    //     cpus_user_usage: value, // Once computed.
    //     cpus_system_time_secs: value,
    //     cpus_system_usage: value, // Once computed.
    //     mem_limit_bytes: value,
    //     mem_rss_bytes: value,
    //   }
    //
    // TODO(bmahler): The complexity of the monitor object is mostly in place
    // until we have path-params on the monitoring endpoint to request
    // statistics for the slave, or for a specific framework / executor.
    //
    // Arguments:
    //   http: $http service from Angular.
    //   timeout: $timeout service from Angular.
    function Top($http, $timeout) {
        this.http = $http;
        this.timeout = $timeout;
    }

    Top.prototype.poll = function() {
        this.http.jsonp(this.endpoint)

            // Success! Parse the response.
            .success(angular.bind(this, this.parseResponse))

            // Do not continue polling on error.
            .error(angular.noop);
    };

    Top.prototype.parseResponse = function(response) {
        var that = this;
        var monitor = {
            frameworks: {},
            statistics: new Statistics()
        };

        response.forEach(function(executor) {
            var executor_id = executor.executor_id;
            var framework_id = executor.framework_id;
            var current = executor.statistics =
                Statistics.parseJSON(executor.statistics);

            current.cpus_user_usage = 0.0;
            current.cpus_system_usage = 0.0;

            // Compute CPU usage if possible.
            if (that.scope.monitor &&
                that.scope.monitor.frameworks[framework_id] &&
                that.scope.monitor.frameworks[framework_id].executors[executor_id]) {
                var previous = that.scope.monitor.frameworks[framework_id].executors[executor_id].statistics;
                current.diffUsage(previous);
            }

            // Index the data.
            if (!monitor.frameworks[executor.framework_id]) {
                monitor.frameworks[executor.framework_id] = {
                    executors: {},
                    statistics: new Statistics()
                };
            }

            // Aggregate these statistics into the slave and framework statistics.
            monitor.statistics.add(current);
            monitor.frameworks[executor.framework_id].statistics.add(current);
            monitor.frameworks[executor.framework_id].executors[executor.executor_id] = {
                statistics: current
            };
        });

        if (this.scope.monitor) {
            // Continue polling.
            this.polling = this.timeout(angular.bind(this, this.poll), 3000);
        } else {
            // Try to compute initial CPU usage more quickly than 3 seconds.
            this.polling = this.timeout(angular.bind(this, this.poll), 500);
        }

        // Update the monitoring data.
        this.scope.monitor = monitor;
    };

    // Arguments:
    //   host: host of slave.
    //   scope: $scope service from Angular.
    Top.prototype.start = function(host, scope) {
        if (this.started()) {
            // TODO(bmahler): Consider logging a warning here.
            return;
        }

        this.endpoint = '//' + host + '/monitor/statistics.json?jsonp=JSON_CALLBACK';
        this.scope = scope;

        // Initial poll is immediate.
        this.polling = this.timeout(angular.bind(this, this.poll), 0);

        // Stop when we leave the page.
        scope.$on('$routeChangeStart', angular.bind(this, this.stop));
    };

    Top.prototype.started = function() {
        return this.polling != null;
    };

    Top.prototype.stop = function() {
        this.timeout.cancel(this.polling);
        this.polling = null;
    };

    mesosServices.service('top', ['$http', '$timeout', Top]);
})();