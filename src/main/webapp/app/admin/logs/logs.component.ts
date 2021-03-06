import { Component, Vue, Inject } from 'vue-property-decorator';

import LogsService from './logs.service';

@Component
export default class JhiLogs extends Vue {
  @Inject('logsService')
  private logsService: () => LogsService;
  private loggers: any[] = [];
  public filtered = '';
  public orderProp = 'name';
  public reverse = false;

  public mounted(): void {
    this.init();
  }

  public init(): void {
    this.logsService()
      .findAll()
      .then(response => {
        this.loggers = response.data;
      });
  }

  public updateLevel(_name, _level): void {
    this.logsService()
      .changeLevel({ name: _name, level: _level })
      .then(() => {
        this.init();
      });
  }

  public changeOrder(orderProp): void {
    this.orderProp = orderProp;
    this.reverse = !this.reverse;
  }
}
