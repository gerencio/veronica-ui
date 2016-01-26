VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.define "mongodb" do |v|
    v.vm.provider "docker" do |d|
      d.vagrant_vagrantfile = ENV['VAGRANT_MAIN_FILE']
      d.vagrant_machine = "core-01"
      d.image = "xdevelsistemas/debian-env:mongodb-env"
      d.ports = ["27017:27017"]
      d.volumes = ["/home/core/data/mongo:/data/db"]
      d.name = "mongodb"
    end
  end

  config.vm.define "redis" do |v|
     v.vm.provider "docker" do |d|
       d.vagrant_vagrantfile = ENV['VAGRANT_MAIN_FILE']
       d.vagrant_machine = "core-01"
       d.image = "xdevelsistemas/debian-env:redis-env"
      d.ports = ["6379:6379"]
      d.volumes = ["/home/core/data/redis:/data"]
      d.name = "redis"
    end
  end

  config.vm.define "zookeeper" do |v|
    v.vm.provider "docker" do |d|
      d.vagrant_vagrantfile = ENV['VAGRANT_MAIN_FILE']
      d.vagrant_machine = "core-01"
      d.env = {
        HOST_ID: "1"
      }
      d.image = "xdevelsistemas/mesosphere-docker:mesos-zookeeper"
      d.ports = ["2181:2181","2888:2888","3888:3888"]
     d.name = "zookeeper"
    end
  end

  config.vm.define "mesos-master" do |v|
    v.vm.provider "docker" do |d|
      d.create_args = ["--net=host"]
      d.vagrant_vagrantfile = ENV['VAGRANT_MAIN_FILE']
      d.vagrant_machine = "core-01"
      d.env = {
           MESOS_HOSTNAME:ENV['DOCKER_HOST_MASTER'],
           MESOS_IP:ENV['DOCKER_HOST_MASTER'],
           MESOS_ZK:"zk://"+ENV['DOCKER_HOST_MASTER']+":2181/mesos",
           MESOS_PORT:"5050",
           MESOS_LOG_DIR:"/var/log/mesos",
           MESOS_QUORUM:"1",
           MESOS_REGISTRY:"in_memory",
           MESOS_WORK_DIR:"/var/lib/mesos"
      }
      d.image = "xdevelsistemas/mesosphere-docker:mesos-master"
      d.ports = ["5050:5050"]
     d.name = "mesos-master"
    end
  end


  config.vm.define "marathon" do |v|
    v.vm.provider "docker" do |d|
      d.vagrant_vagrantfile = ENV['VAGRANT_MAIN_FILE']
      d.vagrant_machine = "core-01"
      d.image = "xdevelsistemas/mesosphere-docker:mesos-marathon"
      d.ports = ["8001:8080"]
      d.name = "marathon"
      d.cmd  = ["--master","zk://"+ENV['DOCKER_HOST_MASTER']+":2181/mesos","--zk","zk://"+ENV['DOCKER_HOST_MASTER']+":2181/mesos"]
    end
  end

  config.vm.define "chronos" do |v|
    v.vm.provider "docker" do |d|
      d.vagrant_vagrantfile = ENV['VAGRANT_MAIN_FILE']
      d.vagrant_machine = "core-01"
      d.image = "xdevelsistemas/chronos"
      d.ports = ["8081:8080"]
      d.name = "chronos"
      d.cmd  = ["bin/start-chronos.bash","--master","zk://"+ENV['DOCKER_HOST_MASTER']+":2181/mesos","--zk_hosts","zk://"+ENV['DOCKER_HOST_MASTER']+":2181/mesos","--http_port","8080"]
    end
  end

end
