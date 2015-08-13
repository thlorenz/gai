; vim: ft=nasm

section .text
global _start
_start:
  nop

.gai_s:
  jmp .uno

.tres:
  dec ebx
  jmp .gai_e

.dos:
  dec ecx
  jmp .tres

.uno:
  inc eax
  jmp .dos

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
