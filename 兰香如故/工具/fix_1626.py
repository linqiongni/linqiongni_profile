# -*- coding: utf-8 -*-
"""Top up short segments of EP27/30/31/33/34/35/36/37 to meet 制作规范 §2
(8-14 segs, >=1400 words, 150-260/seg, zero CJK in audio).
Rebuilds each file ONCE (segment tail append) to avoid partial-edit drops.
Run from 兰香如故/ 根."""
import re, os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)

# seg_index -> appended English sentence (natural continuation)
APPENDS = {
    27: {
        0: " It is a lesson the household will learn slowly, and she faster than any of them.",
        5: " It is the quietest revenge the law allows, and often the kindest.",
        7: " What the sentence meant to end, she turns into a beginning the court never sanctioned.",
    },
    30: {
        0: " The fire that saved her was meant to hide her; the court will now be asked to see her plainly.",
        1: " It is the sort of proof that outlives the hand that left it behind.",
        2: " Each piece alone a careful reader might doubt; set side by side they form a single story the court cannot unread, and a name it can no longer refuse.",
        3: " The throne has seen petitions drafted by the hopeful and dismissed by the busy; this one is different, for it carries the weight of names the court cannot wave aside, and a ledger whose columns name the guilty without flinching or fear, line by patient line.",
        4: " What the great office once protected, the ledger now lays bare, naming each dodge and the man who taught it, until denial has nowhere left to stand and the record speaks for itself.",
        5: " The reversal is no act of mercy handed down from above but justice long delayed, and now, with proof in hand, made plain and simply undeniable to any who read it, the family's name returned by the court that wrongly took it. The name, once taken, returns by the same hand that erred.",
        6: " To speak it aloud is to claim the life the wrongful verdict tried to erase.",
        7: " The fainting of before is ended; what remains is a pride rebuilt around a truth she never chose, and a house remade by it.",
    },
    31: {
        0: " The peace they bought with a frozen gate is the costliest peace the season has shown, and the quietest grief.",
        1: " The loyalty the throne did not earn sits heaviest on the man who gave it without being asked.",
        2: " The cold, which has no politics and no mercy, takes him the way it takes any man who will not move, and the gate keeps its silence.",
        3: " He rode out for this court, cut traitors for it, married beneath his rank for a woman it would have killed, and now the same court asks why he knelt.",
        5: " He lays the marquisate at the feet of the throne that could not save Han Liang, and walks from the capital as a man leaves a fire that took someone he loved.",
        6: " What the capital demanded, Jinling returns without demanding, and the smallness proves lighter than the rank.",
        7: " It is the marriage the edict could never grant, given now by choice and not by command.",
    },
    33: {
        8: " The people's memory is the slower, more durable court, and it has already begun its quiet work of setting the name right.",
    },
    34: {
        4: " A blade finds his side, but the line holds, because a man who will not break is harder to move than a man who will not fall.",
    },
    35: {
        4: " The veterans who served under him speak his name in a tone they did not expect to feel, and lower their voices.",
        8: " The widow keeps the Lin residence and the page that remembers him, and the thread that promises another meeting.",
    },
    36: {
        0: " The years between have been long, and mostly quiet, and they have bent the arc without her noticing.",
        2: " She has become a voice the great house never imagined, writing from a courtyard it once locked her inside.",
        6: " The court's word was never the only word that mattered, and the people's came later and lasted longer.",
        8: " The old companions keep her page warm, and the tale she finished keeps her name alive.",
    },
    37: {
        0: " It is the breath a teller draws before setting the story down for good, and it asks nothing of you but to listen.",
        1: " The coda is where that title finally explains itself, and where the orchid's scent is shown to be the woman.",
        2: " A teller of tales owes the listener the whole of it, and the road, seen whole, makes a kind of sense.",
        3: " Not a stone, not a title, not a court's grudging seal, but a song sung by those who never knew her name.",
        4: " A storm that rose from the southern sea and reached a northern road, now remembered only as part of a stronger tale.",
        5: " It leaves the door open, the way a door is left open for one who is expected and not yet arrived.",
        7: " What you leave with is the warmth of the lamp and the quiet certainty that the road was worth the walking.",
    },
}

# global CJK fixes: old -> new (audio segments must stay ASCII)
CJK_FIX = {
    "the合卺酒 they drank so late": "the hejin cup they drank so late",
}

def rebuild(num):
    p = os.path.join(SRC, f"EP{num:02d}_英文剧集介绍.md")
    t = open(p, encoding="utf-8").read()
    blocks = re.split(r'(<details>.*?</details>)', t, flags=re.S)
    for segidx, app in APPENDS.get(num, {}).items():
        bi = 0 if segidx == 0 else 2 * segidx
        blocks[bi] = blocks[bi].rstrip() + " " + app + "\n\n"
    t2 = "".join(blocks)
    for old, new in CJK_FIX.items():
        if old in t2:
            t2 = t2.replace(old, new)
    open(p, "w", encoding="utf-8").write(t2)
    print(f"EP{num}: rebuilt ({len(blocks)} blocks)")

if __name__ == "__main__":
    for n in APPENDS:
        rebuild(n)
    print("done")
