import { renderToString } from '@vue/server-renderer';
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server';
import { createApp } from './app';
import logoUrl from './favicon.ico';

export { render };
export { onBeforeRender };
export { passToClient };

const passToClient = ['INITIAL_STATE'];

async function render(pageContext) {
  const { appHtml } = pageContext;
  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css">
        <link href="https://www.cheshireeast.gov.uk/siteelements/css/bs5/400-cec-styles.css" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&amp;family=Open+Sans+Condensed:wght@700&amp;display=swap" rel="stylesheet"
    />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Listing of the events organised by Cheshire East Ranger Service" />
        <title>Rangers Events</title>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`;
}

async function onBeforeRender(pageContext) {
  const { Page } = pageContext;
  const { app, store } = createApp({ Page });

  const appHtml = await renderToString(app);

  let url =
    'https://cms-chesheast.cloud.contensis.com/api/delivery/projects/website/contentTypes/rangerEvents/entries?accessToken=QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I&pageSize=500';
  let { items } = await fetch(url).then((response) => {
    return response.json();
  });
  let arr = createDates(items.slice());
  if (arr.length) {
    arr.sort(sortDate);
  }

  store.dispatch('setItems', arr);
  const INITIAL_STATE = store.state;

  return {
    pageContext: {
      INITIAL_STATE,
      appHtml,
    },
  };
}

const sortDate = (a, b) => {
  return a.dateStartEnd.from - b.dateStartEnd.from;
};

const createDates = (arr) => {
  return arr.map((e) => {
    return {
      ...e,
      dateStartEnd: {
        to: new Date(e.dateStartEnd.to),
        from: new Date(e.dateStartEnd.from),
      },
    };
  });
};
