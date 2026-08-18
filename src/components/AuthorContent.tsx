/** 文件说明：作者页 noscript 内容组件，为不执行 JavaScript 的抓取环境输出纯 HTML 文本。 */
"use client";

import { useTranslation } from "@/i18n";

/**
 * 输出作者页的服务端静态文本内容。
 *
 * 该组件包裹在 <noscript> 中，用于为不执行客户端脚本的搜索引擎
 * 提供作者背景、团队信息与公开资料链接，增强作者页可索引性。
 *
 * 仅输出当前路由语言的内容，避免在单一页面中出现双语重复文本。
 */
export default function AuthorContent() {
  const { locale, t } = useTranslation();
  const a = t.author;
  const landing = t.landing;

  const members = [
    { name: a.member1Name, role: a.member1Role, desc: a.member1Desc },
    { name: a.member2Name, role: a.member2Role, desc: a.member2Desc },
    { name: a.member3Name, role: a.member3Role, desc: a.member3Desc },
    { name: a.member4Name, role: a.member4Role, desc: a.member4Desc },
  ];

  return (
    <noscript>
      <section lang={locale}>
        <h2>{a.pageTitle}</h2>
        <p>{a.pageSubtitle}</p>
        <p>{a.intro}</p>

        <div>
          <h2>{a.profileTitle}</h2>
          <h3>{a.profileName}</h3>
          <p>{a.profileRole}</p>
          <p>{a.profileDesc}</p>
        </div>

        <div>
          <h2>{landing.aboutSectionTitle}</h2>
          <div>
            <h3>{landing.aboutWhyTitle}</h3>
            <p>{landing.aboutWhyDesc}</p>
          </div>
          <div>
            <h3>{landing.aboutPrivacyTitle}</h3>
            <p>{landing.aboutPrivacyDesc}</p>
          </div>
          <div>
            <h3>{landing.aboutMindRoseTitle}</h3>
            <p>{landing.aboutMindRoseDesc}</p>
          </div>
          <div>
            <h3>{landing.aboutContactTitle}</h3>
            <p>{landing.aboutContactDesc}</p>
            <p>{landing.aboutContactService}</p>
            <p>
              {landing.aboutContactCTA}{" "}
              <a href="mailto:hello@mindrose.xyz">hello@mindrose.xyz</a>
            </p>
          </div>
        </div>

        <div>
          <h2>{a.verificationTitle}</h2>
          <p>
            <a href="https://www.linkedin.com/in/gavinchensongwen3188536a/">
              {a.linkedInLabel}
            </a>
          </p>
          <p>
            <a href="https://github.com/GavinCnod/deepseek-api-usage-analysis">
              {a.githubLabel}
            </a>
          </p>
          <p>
            <a href="https://mindrose.xyz">{a.websiteLabel}</a>
          </p>
        </div>

        <div id="team-members">
          <h2>{a.teamMembersTitle}</h2>
          <p>{a.teamMembersDesc}</p>
          <div>
            {members.map((member, i) => (
              <div key={i}>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <p>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </noscript>
  );
}