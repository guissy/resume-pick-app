const UNKNOWN_VERSION = null;
const blogs = {
  Next: {
    id: 'next',
    icon: 'next',
    url: 'https://nextjs.org/',
    npm: 'next',
    test(win: {
      __NEXT_DATA__: { buildId: unknown };
      next: { version: string };
    }) {
      // eslint-disable-next-line no-underscore-dangle
      if (win.__NEXT_DATA__ && win.__NEXT_DATA__.buildId) {
        return {
          version: (win.next && win.next.version) || UNKNOWN_VERSION,
        };
      }
      return false;
    },
  },
  Nuxt: {
    id: 'nuxt',
    icon: 'nuxt',
    url: 'https://nuxtjs.org/',
    npm: 'nuxt',
    test(win: { __NUXT__: { data: unknown }; $nuxt: unknown }) {
      // eslint-disable-next-line no-underscore-dangle
      if ((win.__NUXT__ && win.__NUXT__.data != null) || win.$nuxt) {
        return { version: UNKNOWN_VERSION };
      }
      return false;
    },
  },
  Hexo: {
    id: 'Hexo',
    icon: 'Hexo',
    npm: null,
    test() {
      const hasAPILinkElem = !!document.querySelector('meta[content*="Hexo"]');
      const hasWPIncludes = !!document.querySelectorAll(
        'meta[name=generator][content^="Hexo"]'
      ).length;

      if (!hasAPILinkElem && !hasWPIncludes) return false;
      const generatorMeta = document.querySelector(
        'meta[name=generator][content^="Hexo"]'
      );
      const version = generatorMeta
        ? generatorMeta.getAttribute('content')?.replace(/^\w+\s/, '')
        : UNKNOWN_VERSION;
      return { version };
    },
  },
  WordPress: {
    id: 'wordpress',
    icon: 'wordpress',
    url: 'https://wordpress.org/',
    npm: null,
    test() {
      const hasAPILinkElem = !!document.querySelector(
        'link[rel="https://api.w.org/"]'
      );
      const hasWPIncludes = !!document.querySelectorAll(
        'link[href*="wp-includes"], script[src*="wp-includes"]'
      ).length;

      if (!hasAPILinkElem && !hasWPIncludes) return false;

      const generatorMeta = document.querySelector(
        'meta[name=generator][content^="WordPress"]'
      );
      const version = generatorMeta
        ? generatorMeta.getAttribute('content')?.replace(/^\w+\s/, '')
        : UNKNOWN_VERSION;
      return { version };
    },
  },
  jekyll: {
    id: 'jekyll',
    test() {
      const hasAPILinkElem = !!document.querySelector(
        'meta[name=generator][content^="Jekyll"]'
      );

      if (!hasAPILinkElem) return false;

      const generatorMeta = document.querySelector(
        'meta[name=generator][content^="Jekyll"]'
      );
      const version = generatorMeta
        ? generatorMeta.getAttribute('content')?.replace(/^\w+\s/, '')
        : UNKNOWN_VERSION;
      return { version };
    },
  },
  Hugo: {
    id: 'Hugo',
    test() {
      const hasAPILinkElem = !!document.querySelector(
        'meta[name=generator][content^="Hugo"]'
      );

      if (!hasAPILinkElem) return false;

      const generatorMeta = document.querySelector(
        'meta[name=generator][content^="Hugo"]'
      );
      const version = generatorMeta
        ? generatorMeta.getAttribute('content')?.replace(/^\w+\s/, '')
        : UNKNOWN_VERSION;
      return { version };
    },
  },
  Django: {
    id: 'Django',
    test() {
      const hasAPILinkElem = !!document.querySelector(
        'a[rel="nofollow"][href="https://www.djangoproject.com/"]'
      );

      const hasOg = !!document.querySelector(
        '[prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#"]'
      );

      if (!hasAPILinkElem || !hasOg) return false;
      return { version: UNKNOWN_VERSION };
    },
  },
  Drupal: {
    id: 'drupal',
    icon: 'drupal',
    url: 'https://www.drupal.org/',
    npm: null,
    test(win: { Drupal?: { behaviors: string } }) {
      const generatorMeta = document.querySelector(
        'meta[name="generator"][content^="Drupal"]'
      );
      const version = generatorMeta
        ? generatorMeta.getAttribute('content')?.replace(/\D+/gi, '')
        : UNKNOWN_VERSION;

      // Detect Drupal resources patterns
      const resDrupal = /\/sites\/(?:default|all)\/(?:themes|modules|files)/;
      const res = Array.from(
        document.querySelectorAll<HTMLScriptElement & StyleSheet>(
          'link,style,script'
        ) || []
      );

      if (
        res.some((s) => resDrupal.test(s.src)) ||
        res.some((s) => resDrupal.test(s.href || '')) ||
        generatorMeta ||
        (win.Drupal && win.Drupal.behaviors)
      ) {
        return { version };
      }

      return false;
    },
  },
  TYPO3: {
    id: 'typo3',
    icon: 'typo3',
    url: 'https://typo3.org/',
    npm: null,
    test() {
      const generatorMeta = document.querySelector(
        'meta[name="generator"][content^="TYPO3"]'
      );

      // TYPO3 resource patterns / paths - search in link, style or script tags
      const resourcesTYPO3 = /\/(typo3conf|typo3temp|fileadmin)/;
      const res = Array.from(
        document.querySelectorAll<HTMLScriptElement & StyleSheet>(
          'link,style,script'
        ) || []
      );

      if (
        generatorMeta ||
        res.some((s) => resourcesTYPO3.test(s.src)) ||
        res.some((s) => resourcesTYPO3.test(s.href || ''))
      ) {
        // No version exposure available in TYPO3 due to information disclosure
        return { version: UNKNOWN_VERSION };
      }

      return false;
    },
  },
};
