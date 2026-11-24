import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[char] ?? char);
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const certificate = await prisma.certification.findFirst({
    where: { id, status: "ISSUED", enrollment: { userId: user.id } },
    include: { enrollment: { include: { user: true, course: true } } },
  });
  if (!certificate) return NextResponse.json({ error: "Certificado não encontrado" }, { status: 404 });

  let data: { score?: string; issuedBy?: string } = {};
  if (certificate.certificateData) {
    try {
      data = typeof certificate.certificateData === "string" ? JSON.parse(certificate.certificateData) : certificate.certificateData as typeof data;
    } catch { /* dados opcionais */ }
  }
  const student = escapeHtml(certificate.enrollment.user.name ?? "Aluno");
  const course = escapeHtml(certificate.enrollment.course.title);
  const date = certificate.issuedAt ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(certificate.issuedAt) : "";
  const score = data.score ? `<p class="score">Nota final: <strong>${escapeHtml(data.score)}%</strong></p>` : "";
  const code = `CW-${certificate.id.slice(-8).toUpperCase()}`;
  const issuedBy = escapeHtml(data.issuedBy ?? "CW Training");

  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Certificado - ${course}</title><style>
  :root{--ink:#15232d;--muted:#687681;--green:#168267;--gold:#c69a4b}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#edf2f3;color:var(--ink);font-family:Arial,"Helvetica Neue",sans-serif;display:grid;place-items:center;padding:28px}.toolbar{position:fixed;top:20px;right:24px;z-index:2}.print{border:0;border-radius:999px;background:var(--ink);color:#fff;padding:12px 20px;font-weight:700;cursor:pointer;box-shadow:0 8px 24px #15232d2b}.certificate{position:relative;width:min(1120px,100%);aspect-ratio:1.414/1;min-height:640px;overflow:hidden;background:#fff;border:1px solid #cbd8d9;box-shadow:0 24px 70px #15232d24;padding:48px 64px;display:flex;flex-direction:column;justify-content:space-between}.certificate:before,.certificate:after{content:"";position:absolute;border-radius:50%;pointer-events:none}.certificate:before{width:420px;height:420px;right:-180px;top:-210px;background:#16826712;border:1px solid #16826722}.certificate:after{width:300px;height:300px;left:-190px;bottom:-170px;background:#c69a4b12;border:1px solid #c69a4b2b}.frame{position:absolute;inset:18px;border:1px solid var(--gold);pointer-events:none}.top{position:relative;display:flex;justify-content:space-between;align-items:flex-start;z-index:1}.brand{display:flex;align-items:center;gap:12px}.mark{width:46px;height:46px;display:grid;place-items:center;border-radius:12px;background:var(--ink);color:#fff;font-size:14px;font-weight:800;letter-spacing:-.08em}.brand-name{font-size:18px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.brand-sub{display:block;margin-top:4px;color:var(--muted);font-size:10px;letter-spacing:.15em;text-transform:uppercase}.eyebrow{color:var(--green);font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;text-align:right}.content{position:relative;z-index:1;text-align:center;margin:4px auto 0;max-width:820px}.student{margin:17px 0 12px;color:var(--green);font:700 clamp(28px,4vw,46px)/1.1 Georgia,serif}.rule{width:80px;height:3px;margin:22px auto 24px;background:var(--gold)}.intro{margin:0;color:var(--muted);font-size:15px;letter-spacing:.05em}.course-label{margin:0;color:var(--muted);font-size:14px}.course{display:block;margin-top:9px;font-size:22px;font-weight:700;line-height:1.3}.score{margin:14px 0 0;color:var(--muted);font-size:13px}.score strong{color:var(--green)}.details{display:flex;justify-content:center;gap:34px;margin-top:22px;color:var(--muted);font-size:13px}.details strong{color:var(--ink)}.bottom{position:relative;z-index:1;display:grid;grid-template-columns:1fr auto 1fr;align-items:end;gap:26px}.signature{text-align:center;border-top:1px solid #9eaaad;padding-top:8px;color:var(--muted);font-size:11px}.signature strong{display:block;color:var(--ink);font-size:13px;margin-bottom:3px}.seal{width:82px;height:82px;border:2px solid var(--gold);border-radius:50%;display:grid;place-items:center;color:var(--gold);text-align:center;font-size:10px;font-weight:800;line-height:1.15;letter-spacing:.08em;text-transform:uppercase;transform:rotate(-8deg)}.code{text-align:right;color:var(--muted);font-size:10px;letter-spacing:.08em}.code strong{display:block;color:var(--ink);font-size:12px;margin-top:5px}.score strong{color:var(--green)}@media print{@page{size:A4 landscape;margin:0}body{background:#fff;padding:0}.toolbar{display:none}.certificate{width:100vw;height:100vh;aspect-ratio:auto;min-height:0;border:0;box-shadow:none;padding:48px 64px}.frame{inset:18px}}@media(max-width:700px){body{padding:12px}.certificate{aspect-ratio:auto;min-height:720px;padding:42px 30px}.top{gap:18px}.eyebrow{font-size:9px}.details{gap:14px;flex-wrap:wrap}.bottom{grid-template-columns:1fr 1fr}.seal{display:none}.code{grid-column:1/-1;text-align:center}.frame{inset:10px}}</style></head><body><div class="toolbar"><button class="print" onclick="window.print()">Imprimir / Salvar em PDF</button></div><main class="certificate"><div class="frame"></div><header class="top"><div class="brand"><div class="mark">CW</div><div><div class="brand-name">CW Training</div><span class="brand-sub">Formação profissional</span></div></div><div class="eyebrow">Certificação oficial<br>Conclusão de treinamento</div></header><section class="content"><p class="intro">Certificamos, para os devidos fins, que</p><h1 class="student">${student}</h1><div class="rule"></div><p class="course-label">concluiu com aproveitamento o treinamento</p><span class="course">${course}</span>${score}<div class="details"><span>Emitido em <strong>${date}</strong></span><span>Modalidade <strong>Online</strong></span></div></section><footer class="bottom"><div class="signature"><strong>${issuedBy}</strong>Responsável pela certificação</div><div class="seal">CW<br>Training<br>✓</div><div class="code">Código de autenticidade<strong>${code}</strong></div></footer></main></body></html>`;
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
