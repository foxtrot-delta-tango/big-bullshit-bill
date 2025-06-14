<template>
  <div class="whats-next">
    <section>
      <h1>How can I fight back?</h1>
      <p>
        Are you <a href='https://www.youtube.com/watch?v=rGIY5Vyj4YM' target='_blank' rel='noopener noreferrer'>mad as hell</a>?
        Are you not going to take this anymore?
      </p>
      <p>
        Do you want to do something about it?!
      </p>
      <p>
        Well, you’re not alone!
        Many Americans are feeling the 🔥 right now.  
      </p>
      <p>
        Here are a list of suggestions on how to channel your energy into action:
      </p>
      <ul>
        <li>Contact your representatives to make your voice heard with the help of a utility like <a href='https://5calls.org/' target="_blank">5Calls.org</a>, a fantastic website that helps provide you with prompts and information to easily make five calls to your representatives.</li>
        <li>Visit the <router-link to="/about">About</router-link> page to learn more about this project and volunteer to help improve it.</li>
        <li>Get involved with local activist groups, such as <a href='https://www.indivisible.org/' target="_blank">Indivisible</a> or <a href='https://www.50501.org'>50501</a>.</li>
        <li>Check out news aggregates like <a href='https://ground.news/' target="_blank">Ground News</a> to better evaluate the news you are consuming.</li>
        <li>Even if you do not cannot participate in person or volunteer, try to do your best to take care of the people around you, and keep your spirits up!  We are all in this together.  🌎</li>
      </ul>
    </section>
    <section class="cta">
      <p>
        <strong>Whatever you do, just don't do nothing.</strong>
      </p>
      <p>
        <em>'The only thing necessary for the triumph of evil is for good people to do nothing.'</em>
      </p>
      <p>
        Together, <strong>we can make a difference</strong>.
        Thanks!
      </p>
    </section>
  </div>
</template>

<style scoped lang='scss'>
.whats-next {
  padding: 1em 10em;
  
  @media (max-width: 1200px) {
    padding: 1em;

    ul {
      margin: 1em;
    }
  }
}

section {
  background: var(--color-section-bg);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;

  h1 {
    color: var(--color-text);
    text-align: center;
    text-transform: uppercase;
  }

  p {
    color: var(--color-text-light);
    text-indent: 1.5em;
    margin: 0.25em;
    text-align: center;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5em;
    margin: 2em 10em;

    li {
      margin-bottom: 0.5em;
      color: var(--color-text);
    }
  }

  &.cta {
    padding-bottom: 2em;
    strong {
      color: var(--color-primary);
      font-weight: bold;
      text-transform: uppercase;
    }

    em {
      color: var(--color-primary);
    }
  }
}
</style>
