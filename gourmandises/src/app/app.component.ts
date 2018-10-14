import { Component, HostListener } from '@angular/core';
declare const window: any;
declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Les Gourmandises de Ludivine';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const mq = window.matchMedia('(max-width: 1150px)');
    mq.addListener(WidthChange);
    WidthChange(mq);

    function WidthChange(mq) {
      if (mq.matches && number > 830) {
        $('.cakes-nav').removeClass('homeNav');
        $('.cakes-nav').removeClass('notHomePage');
        $('.cakes-nav li a').attr('style', 'color: #fff');
        $('.navbar-brand').attr('style', 'color: #f14e95 !important');
        $('.cakes-nav').css('padding', '20px');
        $('.cakes-nav').css('background-color', 'black');
      } else if (mq.matches && number < 830) {
        $('.cakes-nav').removeClass('homeNav');
        $('.cakes-nav').removeClass('notHomePage');
        $('.cakes-nav a').css('color', '#fff');
        $('.cakes-nav').css('padding', '40px 0');
        $('.bg-light').attr(
          'style',
          'background-color: transparent !important'
        );
        $('a')
          .hover(function() {
            $(this).addClass('scrolla');
          })
          .mouseout(function() {
            $(this).removeClass('scrolla');
          });
      } else if (!mq.matches && number > 830) {
        $('.cakes-nav').removeClass('homeNav');
        $('.cakes-nav').removeClass('notHomePage');
        $('.cakes-nav a').attr('style', 'color: #f14e95 !important');
        $('.cakes-nav').css('padding', '0');
        $('.cakes-nav').css('background-color', 'black');
        $('a')
          .hover(function() {
            $(this).addClass('scrolla');
          })
          .mouseout(function() {
            $(this).removeClass('scrolla');
          });
      } else if (!mq.matches && number < 830) {
        $('.cakes-nav').removeClass('homeNav');
        $('.cakes-nav').removeClass('notHomePage');
        $('.cakes-nav a').css('color', '#fff');
        $('.cakes-nav').css('padding', '40px 0');
        $('.bg-light').attr(
          'style',
          'background-color: transparent !important'
        );
        $('a')
          .hover(function() {
            $(this).addClass('scrolla');
          })
          .mouseout(function() {
            $(this).removeClass('scrolla');
          });
      }
    }
  }
}
